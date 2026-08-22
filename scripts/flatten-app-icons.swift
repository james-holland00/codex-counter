import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let paths = [
    "assets/icon-192.png",
    "assets/icon-512.png",
    "assets/apple-touch-icon.png",
    "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png",
]

for path in paths {
    let url = URL(fileURLWithPath: path)
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
          let width = properties[kCGImagePropertyPixelWidth] as? Int,
          let height = properties[kCGImagePropertyPixelHeight] as? Int else {
        fatalError("Unable to inspect \(path)")
    }
    guard let context = CGContext(
        data: nil,
        width: width,
        height: height,
        bitsPerComponent: 8,
        bytesPerRow: width * 4,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue
    ) else {
        fatalError("Unable to allocate opaque image for \(path)")
    }

    context.setFillColor(red: 11.0 / 255.0, green: 49.0 / 255.0, blue: 41.0 / 255.0, alpha: 1)
    context.fill(CGRect(x: 0, y: 0, width: width, height: height))

    let scale = CGFloat(width) / 512.0
    context.saveGState()
    context.scaleBy(x: scale, y: scale)
    context.setFillColor(red: 204.0 / 255.0, green: 231.0 / 255.0, blue: 217.0 / 255.0, alpha: 1)
    context.fillEllipse(in: CGRect(x: 174, y: 260, width: 164, height: 164))
    context.fillEllipse(in: CGRect(x: 100, y: 172, width: 164, height: 164))
    context.fillEllipse(in: CGRect(x: 248, y: 172, width: 164, height: 164))

    let stem = CGMutablePath()
    stem.move(to: CGPoint(x: 226, y: 228))
    stem.addCurve(to: CGPoint(x: 183, y: 88), control1: CGPoint(x: 231, y: 171), control2: CGPoint(x: 219, y: 132))
    stem.addLine(to: CGPoint(x: 329, y: 88))
    stem.addCurve(to: CGPoint(x: 286, y: 228), control1: CGPoint(x: 293, y: 132), control2: CGPoint(x: 281, y: 171))
    stem.closeSubpath()
    context.addPath(stem)
    context.fillPath()
    context.restoreGState()

    guard let flattened = context.makeImage() else { fatalError("Unable to render \(path)") }
    let temporaryURL = url.deletingLastPathComponent().appendingPathComponent(".\(url.lastPathComponent).opaque")
    guard let destination = CGImageDestinationCreateWithURL(temporaryURL as CFURL, UTType.png.identifier as CFString, 1, nil) else {
        fatalError("Unable to create output for \(path)")
    }
    CGImageDestinationAddImage(destination, flattened, nil)
    guard CGImageDestinationFinalize(destination) else { fatalError("Unable to encode \(path)") }
    try Data(contentsOf: temporaryURL).write(to: url, options: .atomic)
    try FileManager.default.removeItem(at: temporaryURL)
    print("Flattened \(path)")
}
