import AppKit
import Foundation

let width: CGFloat = 1320
let height: CGFloat = 2868
let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let sourceDirectory = root.appendingPathComponent("app-store/screenshots/6.9-inch")
let outputDirectory = root.appendingPathComponent("app-store/marketing-screenshots/v3-working")
let backgroundURL = root.appendingPathComponent("app-store/marketing-screenshots/assets/counted-flat-background-v3.png")

struct Panel {
  let source: String
  let output: String
  let kicker: String
  let title: String
  let body: String
  let phoneX: CGFloat
  let phoneY: CGFloat
  let phoneWidth: CGFloat
  let rotation: CGFloat
}

// Screens 3–6 each contain a complete, front-facing device.
let panels = [
  Panel(source: "03-rapid-flash.png", output: "03-build-real-speed.png", kicker: "RAPID FLASH", title: "Build real\nspeed.", body: "Sharpen recognition under pressure.", phoneX: 240, phoneY: 900, phoneWidth: 840, rotation: 0),
  Panel(source: "02-casino.png", output: "04-stay-sharp.png", kicker: "CASINO MODE", title: "Stay sharp\nat table pace.", body: "A focused, off-table drill.", phoneX: 240, phoneY: 900, phoneWidth: 840, rotation: 0),
  Panel(source: "05-progress.png", output: "05-go-further-with-pro.png", kicker: "PROGRESS", title: "See the work\npay off.", body: "Your growth stays on your device.", phoneX: 240, phoneY: 900, phoneWidth: 840, rotation: 0),
  Panel(source: "02-casino.png", output: "06-train-at-table-pace.png", kicker: "COUNTED PRO", title: "Go further\nwith Pro.", body: "Rapid Flash and Casino Mode.", phoneX: 240, phoneY: 900, phoneWidth: 840, rotation: 0),
]

func color(_ red: CGFloat, _ green: CGFloat, _ blue: CGFloat, _ alpha: CGFloat = 1) -> NSColor {
  NSColor(calibratedRed: red / 255, green: green / 255, blue: blue / 255, alpha: alpha)
}

func drawText(_ string: String, in rect: CGRect, font: NSFont, color: NSColor, tracking: CGFloat = 0) {
  let paragraph = NSMutableParagraphStyle()
  paragraph.lineBreakMode = .byWordWrapping
  let attributes: [NSAttributedString.Key: Any] = [.font: font, .foregroundColor: color, .kern: tracking, .paragraphStyle: paragraph]
  NSAttributedString(string: string, attributes: attributes).draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading])
}

func drawPhone(_ screen: NSImage, x: CGFloat, y: CGFloat, width: CGFloat, rotation: CGFloat) {
  let phoneHeight = width * 2.17
  let context = NSGraphicsContext.current!.cgContext
  context.saveGState()
  context.translateBy(x: x + width / 2, y: y + phoneHeight / 2)
  context.rotate(by: rotation * .pi / 180)
  context.translateBy(x: -width / 2, y: -phoneHeight / 2)
  let screenRect = CGRect(x: 0, y: 0, width: width, height: phoneHeight)

  context.saveGState()
  let shadow = NSShadow()
  shadow.shadowColor = color(0, 0, 0, 0.62)
  shadow.shadowOffset = NSSize(width: 0, height: 26)
  shadow.shadowBlurRadius = 38
  shadow.set()
  color(5, 8, 7).setFill()
  NSBezierPath(roundedRect: screenRect, xRadius: 92, yRadius: 92).fill()
  context.restoreGState()

  // No physical border or white shell: the full app screen is the complete device face.
  let clip = NSBezierPath(roundedRect: screenRect, xRadius: 92, yRadius: 92)
  context.saveGState()
  clip.addClip()
  screen.draw(in: screenRect, from: CGRect(origin: .zero, size: screen.size), operation: .sourceOver, fraction: 1, respectFlipped: true, hints: [.interpolation: NSImageInterpolation.high])
  if rotation != 0 {
    color(255, 255, 255, 0.09).setFill()
    let glare = NSBezierPath()
    glare.move(to: CGPoint(x: width * 0.58, y: -40))
    glare.line(to: CGPoint(x: width * 0.82, y: -40))
    glare.line(to: CGPoint(x: width * 1.03, y: phoneHeight + 40))
    glare.line(to: CGPoint(x: width * 0.79, y: phoneHeight + 40))
    glare.close()
    glare.fill()
  }
  context.restoreGState()

  // Clean Dynamic Island, with no outer hardware bezel.
  color(2, 3, 3).setFill()
  NSBezierPath(roundedRect: CGRect(x: width / 2 - 136, y: 38, width: 272, height: 64), xRadius: 32, yRadius: 32).fill()
  context.restoreGState()
}

func drawIntroPanel(side: Int, background: NSImage, screen: NSImage) -> NSImage {
  let titles = ["Learn the\nHi-Lo count.", "Make it\nautomatic."]
  let kickers = ["COUNTED", "PRACTICE"]
  let bodies = ["Three values. One clear system.", "One card at a time."]
  let output = NSImage(size: NSSize(width: width, height: height))
  output.lockFocusFlipped(true)
  background.draw(in: CGRect(x: 0, y: 0, width: width, height: height), from: CGRect(origin: .zero, size: background.size), operation: .sourceOver, fraction: 1, respectFlipped: true, hints: [.interpolation: NSImageInterpolation.high])
  color(0, 10, 7, 0.24).setFill()
  NSBezierPath(rect: CGRect(x: 0, y: 0, width: width, height: height)).fill()
  color(174, 235, 214).setFill()
  NSBezierPath(roundedRect: CGRect(x: 75, y: 88, width: 15, height: 15), xRadius: 8, yRadius: 8).fill()
  drawText(kickers[side], in: CGRect(x: 110, y: 247, width: 960, height: 48), font: NSFont.systemFont(ofSize: 24, weight: .bold), color: color(191, 238, 218), tracking: 5)
  drawText(titles[side], in: CGRect(x: 72, y: 343, width: 1120, height: 250), font: NSFont(name: "Georgia-Bold", size: 82) ?? NSFont.systemFont(ofSize: 82, weight: .bold), color: color(252, 250, 243), tracking: -1.5)
  drawText(bodies[side], in: CGRect(x: 76, y: 633, width: 1040, height: 70), font: NSFont.systemFont(ofSize: 30, weight: .medium), color: color(205, 225, 216))
  // One complete angled phone spans Screens 1 and 2 only. It never exceeds their combined 2640px width or 2868px height.
  drawPhone(screen, x: 900 - CGFloat(side) * width, y: 910, width: 760, rotation: -7)
  drawText("counted", in: CGRect(x: 76, y: 2721, width: 460, height: 62), font: NSFont(name: "Georgia-Bold", size: 40) ?? NSFont.systemFont(ofSize: 40, weight: .bold), color: color(235, 247, 241), tracking: 1)
  drawText("BLACKJACK TRAINER", in: CGRect(x: 78, y: 2780, width: 480, height: 35), font: NSFont.systemFont(ofSize: 18, weight: .bold), color: color(168, 217, 197), tracking: 3)
  output.unlockFocus()
  return output
}

guard let background = NSImage(contentsOf: backgroundURL) else { fatalError("Missing v3 background") }
try? FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

guard let introScreen = NSImage(contentsOf: sourceDirectory.appendingPathComponent("01-practice.png")) else { fatalError("Missing intro screenshot") }
for side in 0...1 {
  let canvas = drawIntroPanel(side: side, background: background, screen: introScreen)
  let filename = side == 0 ? "01-learn-the-count.png" : "02-practice-with-purpose.png"
  guard let data = canvas.tiffRepresentation, let bitmap = NSBitmapImageRep(data: data), let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("Could not encode \(filename)") }
  try png.write(to: outputDirectory.appendingPathComponent(filename))
}

// Review aid only: confirms the split hero becomes one complete device when the first two App Store cards sit adjacent.
let firstIntro = drawIntroPanel(side: 0, background: background, screen: introScreen)
let secondIntro = drawIntroPanel(side: 1, background: background, screen: introScreen)
let introPreview = NSImage(size: NSSize(width: width * 2, height: height))
introPreview.lockFocusFlipped(true)
firstIntro.draw(in: CGRect(x: 0, y: 0, width: width, height: height))
secondIntro.draw(in: CGRect(x: width, y: 0, width: width, height: height))
introPreview.unlockFocus()
if let data = introPreview.tiffRepresentation, let bitmap = NSBitmapImageRep(data: data), let png = bitmap.representation(using: .png, properties: [:]) {
  try png.write(to: outputDirectory.appendingPathComponent("00-first-pair-preview.png"))
}

for panel in panels {
  guard let screen = NSImage(contentsOf: sourceDirectory.appendingPathComponent(panel.source)) else { fatalError("Missing screenshot: \(panel.source)") }
  let canvas = NSImage(size: NSSize(width: width, height: height))
  canvas.lockFocusFlipped(true)
  background.draw(in: CGRect(x: 0, y: 0, width: width, height: height), from: CGRect(origin: .zero, size: background.size), operation: .sourceOver, fraction: 1, respectFlipped: true, hints: [.interpolation: NSImageInterpolation.high])
  color(0, 10, 7, 0.24).setFill()
  NSBezierPath(rect: CGRect(x: 0, y: 0, width: width, height: height)).fill()
  color(174, 235, 214).setFill()
  NSBezierPath(roundedRect: CGRect(x: 75, y: 88, width: 15, height: 15), xRadius: 8, yRadius: 8).fill()
  drawText(panel.kicker, in: CGRect(x: 110, y: 247, width: 960, height: 48), font: NSFont.systemFont(ofSize: 24, weight: .bold), color: color(191, 238, 218), tracking: 5)
  drawText(panel.title, in: CGRect(x: 72, y: 343, width: 1120, height: 250), font: NSFont(name: "Georgia-Bold", size: 82) ?? NSFont.systemFont(ofSize: 82, weight: .bold), color: color(252, 250, 243), tracking: -1.5)
  drawText(panel.body, in: CGRect(x: 76, y: 633, width: 1040, height: 70), font: NSFont.systemFont(ofSize: 30, weight: .medium), color: color(205, 225, 216))
  drawPhone(screen, x: panel.phoneX, y: panel.phoneY, width: panel.phoneWidth, rotation: panel.rotation)
  drawText("counted", in: CGRect(x: 76, y: 2721, width: 460, height: 62), font: NSFont(name: "Georgia-Bold", size: 40) ?? NSFont.systemFont(ofSize: 40, weight: .bold), color: color(235, 247, 241), tracking: 1)
  drawText("BLACKJACK TRAINER", in: CGRect(x: 78, y: 2780, width: 480, height: 35), font: NSFont.systemFont(ofSize: 18, weight: .bold), color: color(168, 217, 197), tracking: 3)
  canvas.unlockFocus()
  guard let data = canvas.tiffRepresentation, let bitmap = NSBitmapImageRep(data: data), let png = bitmap.representation(using: .png, properties: [:]) else { fatalError("Could not encode \(panel.output)") }
  try png.write(to: outputDirectory.appendingPathComponent(panel.output))
}
