import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.tripture",
  appName: "Tripture",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
