module.exports = {
  name: "knight",
  slug: "knight",
  version: "1.0.0",
  scheme: "knight",
  orientation: "portrait",
  icon: "./assets/images/usedLogo.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/images/usedLogo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    googleServicesFile: "./GoogleService-Info.plist",
    supportsTablet: true,
    bundleIdentifier: "com.swent.knight",
  },
  android: {
    googleServicesFile: "./google-services.json",
    adaptiveIcon: {
      foregroundImage: "./assets/images/usedLogo.png",
      backgroundColor: "#ffffff",
    },
    permissions: ["android.permission.DETECT_SCREEN_CAPTURE"],
    package: "com.swent.knight",
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    favicon: "./assets/images/usedLogo.png",
    bundler: "metro",
  },
  plugins: [
    [
      "expo-build-properties",
      {
        ios: {
          userFrameworks: "static",
        },
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/KaiseiDecol-Regular.ttf",
          "./assets/fonts/KaiseiDecol-Medium.ttf",
          "./assets/fonts/KaiseiDecol-Bold.ttf",
        ],
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "142c7bbe-0be4-436f-a8dc-428931c2c284",
    },
  },
  owner: "knight-swent",
};
