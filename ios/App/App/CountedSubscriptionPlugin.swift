import Capacitor
import StoreKit
import UIKit

@objc(CountedSubscriptionPlugin)
final class CountedSubscriptionPlugin: CAPPlugin, CAPBridgedPlugin {
    let identifier = "CountedSubscriptionPlugin"
    let jsName = "CountedSubscription"
    let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getStatus", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "manageSubscriptions", returnType: CAPPluginReturnPromise)
    ]

    private let productID = "com.jamesholland.counted.pro.annual"
    private var transactionListener: Task<Void, Never>?

    @objc override func load() {
        transactionListener = Task { [weak self] in
            for await update in Transaction.updates {
                guard let self else { return }
                if case .verified(let transaction) = update {
                    await transaction.finish()
                }
                await self.publishStatus()
            }
        }
    }

    deinit {
        transactionListener?.cancel()
    }

    @objc func getStatus(_ call: CAPPluginCall) {
        Task {
            do {
                call.resolve(try await status())
            } catch {
                call.reject("Counted Pro status is unavailable.", nil, error)
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        Task {
            do {
                guard AppStore.canMakePayments else {
                    return call.reject("Purchases are not allowed on this device.")
                }
                guard let product = try await Product.products(for: [productID]).first else {
                    return call.reject("Counted Pro is not available in the current StoreKit environment.")
                }

                switch try await product.purchase() {
                case .success(let verification):
                    guard case .verified(let transaction) = verification else {
                        return call.reject("Apple could not verify this purchase.")
                    }
                    await transaction.finish()
                    let updated = try await status()
                    call.resolve(updated)
                    notifyListeners("subscriptionChanged", data: updated)
                case .pending:
                    var pending = try await status()
                    pending["pending"] = true
                    call.resolve(pending)
                case .userCancelled:
                    call.reject("Purchase cancelled.")
                @unknown default:
                    call.reject("The purchase returned an unknown result.")
                }
            } catch {
                call.reject("The purchase could not be completed.", nil, error)
            }
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
                let updated = try await status()
                call.resolve(updated)
                notifyListeners("subscriptionChanged", data: updated)
            } catch {
                call.reject("Purchases could not be restored.", nil, error)
            }
        }
    }

    @objc func manageSubscriptions(_ call: CAPPluginCall) {
        Task {
            guard let scene = await MainActor.run(body: {
                UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first { $0.activationState == .foregroundActive }
            }) else {
                return call.reject("The App Store subscription screen is unavailable.")
            }

            do {
                try await AppStore.showManageSubscriptions(in: scene)
                call.resolve()
            } catch {
                call.reject("The App Store subscription screen could not be opened.", nil, error)
            }
        }
    }

    private func status() async throws -> [String: Any] {
        let products = try await Product.products(for: [productID])
        let product = products.first
        var isPro = false
        var expirationDate: Date?

        if let entitlement = await Transaction.currentEntitlement(for: productID),
           case .verified(let transaction) = entitlement,
           transaction.revocationDate == nil,
           transaction.expirationDate.map({ $0 > Date() }) ?? true {
            isPro = true
            expirationDate = transaction.expirationDate
        }

        var result: [String: Any] = [
            "productID": productID,
            "isPro": isPro,
            "productAvailable": product != nil,
            "displayPrice": product?.displayPrice ?? "£2.99"
        ]
        if let expirationDate {
            result["expirationDate"] = ISO8601DateFormatter().string(from: expirationDate)
        }
        return result
    }

    private func publishStatus() async {
        guard let current = try? await status() else { return }
        notifyListeners("subscriptionChanged", data: current)
    }
}
