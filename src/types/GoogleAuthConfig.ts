type GoogleAuthConfig = {
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
  redirectUri?: string;
};

const all: GoogleAuthConfig = {
  iosClientId:
    "983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl.apps.googleusercontent.com",
  androidClientId:
    "983400403511-467t4ccjvp59l78v073svkflfus76ltt.apps.googleusercontent.com",
  webClientId:
    "983400403511-ff4ntmj4f9qvmmcc6nqh68tn524bp740.apps.googleusercontent.com",
  redirectUri:
    "com.googleusercontent.apps.983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl:/oauth2redirect/google",
};

const ios: GoogleAuthConfig = {
  iosClientId:
    "983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl.apps.googleusercontent.com",
  redirectUri:
    "com.googleusercontent.apps.983400403511-gi5mo0akb89fcecaivk4q509c63hrvtl:/oauth2redirect/google",
};

const android: GoogleAuthConfig = {
  androidClientId:
    "983400403511-467t4ccjvp59l78v073svkflfus76ltt.apps.googleusercontent.com",
};

const web: GoogleAuthConfig = {
  webClientId:
    "983400403511-ff4ntmj4f9qvmmcc6nqh68tn524bp740.apps.googleusercontent.com",
};

export default { all, ios, android, web };
