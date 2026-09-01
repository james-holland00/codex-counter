import Capacitor

final class CountedBridgeViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginType(CountedSubscriptionPlugin.self)
    }
}
