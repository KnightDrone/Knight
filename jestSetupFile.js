const { getApps, getApp } = require("firebase/app");
const { initializeAuth } = require("firebase/auth");
const { getFirestore, initializeFirestore } = require("firebase/firestore");

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  initializeFirestore: jest.fn(),
  collection: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn().mockResolvedValue({
    exists: jest.fn().mockReturnValue(true),
    data: jest.fn().mockReturnValue({
      withConverter: jest.fn(),
      getUser: "admin",
    }),
  }),
  getDocs: jest.fn(),
  query: jest.fn(),
  setDoc: jest.fn(),
  where: jest.fn(),
}));

jest.mock("@react-native-firebase/firestore", () => ({
  firestore: jest.fn(),
}));

jest.mock("expo-auth-session/providers/google", () => ({
  useAuthRequest: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  initializeAuth: jest.fn(),
  getReactNativePersistence: jest.fn(),
  GoogleAuthProvider: {
    credential: jest.fn(() => "mock-credential"), // Ensure this returns a mock credential as expected
  },
  signInWithCredential: jest.fn(() => Promise.resolve({ user: true })), // Explicitly return a resolved promise
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: true })), // Explicitly return a resolved promise
  signOut: jest.fn(() => Promise.resolve()), // Explicitly return a resolved promise
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({ user: true })
  ), // Explicitly return a resolved promise
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

jest.mock("@stripe/stripe-react-native", () => ({
  __esModule: true,
  StripeProvider: jest.fn(() => null),
  PaymentSheetError: jest.fn(),
  confirmPaymentSheetPayment: jest.fn(),
  useStripe: jest.fn().mockReturnValue({
    confirmPayment: jest.fn(),
    createPaymentMethod: jest.fn(),
    retrievePaymentIntent: jest.fn(),
    initPaymentSheet: jest
      .fn()
      .mockResolvedValue(Promise.resolve({ error: null })),
    presentPaymentSheet: jest
      .fn()
      .mockReturnValue(Promise.resolve({ error: null })),
    confirmPaymentSheetPayment: jest.fn(),
  }),
}));

// include this line for mocking react-native-gesture-handler
import "react-native-gesture-handler/jestSetup";

// include this section and the NativeAnimatedHelper section for mocking react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
