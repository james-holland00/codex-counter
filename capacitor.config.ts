import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.jamesholland.counted",
  appName: "Counted",
  webDir: "public/trainer",
  backgroundColor: "#111312",
  zoomEnabled: false,
  ios: {
    allowsLinkPreview: false,
    contentInset: "never",
    preferredContentMode: "mobile",
    scrollEnabled: true,
  },
};

export default config;
