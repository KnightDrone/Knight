import { signInWithCredential } from "firebase/auth";
import { isValidEmail, logInWithGoogle } from "../src/utils/Auth";
import FirestoreManager from "../src/services/FirestoreManager";
import { registerIndieID } from "native-notify";

// Mocking necessary modules and methods
jest.mock("firebase/auth");
jest.mock("../src/services/FirestoreManager");
jest.mock("native-notify", () => ({
  registerIndieID: jest.fn(),
  unregisterIndieDevice: jest.fn(),
}));

describe("isValidEmail", () => {
  it("should return true for a valid email", () => {
    const email = "test@example.com";
    const result = isValidEmail(email);
    expect(result).toBe(true);
  });

  it("should return false for an invalid email", () => {
    const email = "invalidemail";
    const result = isValidEmail(email);
    expect(result).toBe(false);
  });
});

describe("logInWithGoogle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    (signInWithCredential as jest.Mock).mockResolvedValue({
      user: {
        metadata: {
          creationTime: "2022-01-01T00:00:00.000Z",
          lastSignInTime: "2022-01-01T00:00:00.000Z",
        },
        displayName: "Test User",
        email: "test@example.com",
        photoURL: "http://test.com/photo.jpg",
        uid: "testUID",
      },
    });
  });

  it("should log in a new user", (done) => {
    const navigation = { navigate: jest.fn() };
    const firestoreManager = new FirestoreManager();
    firestoreManager.createUser = jest.fn().mockResolvedValue({});
    firestoreManager.getUser = jest.fn().mockResolvedValue(null);

    logInWithGoogle({}, navigation, firestoreManager);

    // Using setImmediate to ensure the function is called after the promise resolves
    setImmediate(() => {
      expect(navigation.navigate).toHaveBeenCalledWith("UserDrawer");
      expect(firestoreManager.createUser).toHaveBeenCalledWith(
        "testUID",
        expect.objectContaining({
          name: "Test User",
          email: "test@example.com",
          photoURL: "http://test.com/photo.jpg",
          role: "user",
        })
      );
      done();
    });
  });

  it("should navigate to OperatorDrawer if user is operator", (done) => {
    (signInWithCredential as jest.Mock).mockResolvedValue({
      user: {
        metadata: {
          creationTime: "2022-01-01T00:00:00.000Z",
          lastSignInTime: "2022-01-02T00:00:00.000Z",
        },
        displayName: "Test User",
        email: "test@example.com",
        photoURL: "http://test.com/photo.jpg",
        uid: "operatorUID",
      },
    });

    const navigation = { navigate: jest.fn() };
    const firestoreManager = new FirestoreManager();
    firestoreManager.getUser = jest.fn().mockResolvedValue({
      role: "operator",
    });

    logInWithGoogle({}, navigation, firestoreManager);

    // Using setImmediate to ensure the function is called after the promise resolves
    setImmediate(() => {
      expect(navigation.navigate).toHaveBeenCalledWith("OperatorDrawer");
      done();
    });
  });

  it("should navigate to UserDrawer if user is not operator", (done) => {
    (signInWithCredential as jest.Mock).mockResolvedValue({
      user: {
        metadata: {
          creationTime: "2022-01-01T00:00:00.000Z",
          lastSignInTime: "2022-01-02T00:00:00.000Z",
        },
        displayName: "Test User",
        email: "test@example.com",
        photoURL: "http://test.com/photo.jpg",
        uid: "userUID",
      },
    });

    const navigation = { navigate: jest.fn() };
    const firestoreManager = new FirestoreManager();
    firestoreManager.getUser = jest.fn().mockResolvedValue({
      role: "user",
    });

    logInWithGoogle({}, navigation, firestoreManager);

    // Using setImmediate to ensure the function is called after the promise resolves
    setImmediate(() => {
      expect(navigation.navigate).toHaveBeenCalledWith("UserDrawer");
      done();
    });
  });
});
