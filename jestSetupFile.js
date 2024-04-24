const { getFirestore } = require("firebase/firestore");

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
  getAnalytics: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(() => "mock-credential"), // Ensure this returns a mock credential as expected
  },
  signInWithCredential: jest.fn(() => Promise.resolve({ user: true })), // Explicitly return a resolved promise
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: true })), // Explicitly return a resolved promise
  signOut: jest.fn(() => Promise.resolve()), // Explicitly return a resolved promise
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: true })
  ), // Explicitly return a resolved promise
  signInWithPopup: jest.fn(() => Promise.resolve({ user: true })), // Explicitly return a resolved promise
  signInWithRedirect: jest.fn(() => Promise.resolve({ user: true })), // Explicitly return a resolved promise
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock("react-native-vector-icons/FontAwesome", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((props) => <View {...props} />),
  };
});

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("react-native-vector-icons/MaterialIcons", () => {
  const { Text } = require("react-native");
  return ({ name, size, color, testID }) => (
    <Text testID={testID}>
      {name} {size} {color}
    </Text>
  );
});

jest.mock("react-native-vector-icons/Fontisto", () => {
  const { Text } = require("react-native");
  return ({ name, size, color, testID }) => (
    <Text testID={testID}>
      {name} {size} {color}
    </Text>
  );
});

jest.mock("react-native-maps", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: jest
      .fn()
      .mockImplementation((props) => <View {...props} testID="map-view" />),
    Marker: jest
      .fn()
      .mockImplementation((props) => <View {...props} testID="map-marker" />),
  };
});

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" })
  ),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({
    coords: {
      latitude: 34.0522,
      longitude: -118.2437,
      altitude: 0,
      accuracy: 5,
      altitudeAccuracy: 5,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);
