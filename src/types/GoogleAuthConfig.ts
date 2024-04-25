type GoogleAuthConfig = {
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
  redirectUri?: string;
};

const all: GoogleAuthConfig = {
  iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID_OAUTH,
  androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID_OAUTH,
  webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID_OAUTH,
  redirectUri: process.env.EXPO_PUBLIC_REDIRECT_URI,
};

const ios: GoogleAuthConfig = {
  iosClientId: process.env.IOS_CLIENT_ID_OAUTH,
  androidClientId: process.env.ANDROID_CLIENT_ID_OAUTH,
  webClientId: process.env.WEB_CLIENT_ID_OAUTH,
  redirectUri: process.env.REDIRECT_URI,
};

const android: GoogleAuthConfig = {
  androidClientId: process.env.ANDROID_CLIENT_ID_OAUTH,
  webClientId: process.env.WEB_CLIENT_ID_OAUTH,
  iosClientId: process.env.IOS_CLIENT_ID_OAUTH,
  redirectUri: process.env.REDIRECT_URI,
};

const web: GoogleAuthConfig = {
  iosClientId: process.env.IOS_CLIENT_ID_OAUTH,
  androidClientId: process.env.ANDROID_CLIENT_ID_OAUTH,
  webClientId: process.env.WEB_CLIENT_ID_OAUTH,
  redirectUri: process.env.REDIRECT_URI,
};

export default { all, ios, android, web };
