// import React from 'react';
// import { fireEvent, render, waitFor } from '@testing-library/react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { AuthStack } from '../src/navigation/StackNavigation';
// import { UserStack } from '../src/navigation/StackNavigation';

// describe('AuthStack Navigation', () => {
//   it('renders the login screen as the initial route', () => {
//     const { getByTestId } = render(
//       <NavigationContainer>
//         <AuthStack />
//       </NavigationContainer>
//     );
//     expect(getByTestId('login-screen')).toBeTruthy();
//   });

//   it('navigates to the sign up screen when the sign up button is pressed', async () => {
//     const { getByTestId } = render(
//       <NavigationContainer>
//         <AuthStack />
//       </NavigationContainer>
//     );
//     fireEvent.press(getByTestId('sign-up-link'));
//     await waitFor(() => {
//       expect(getByTestId('sign-up-screen')).toBeTruthy();
//     });
//   });

//   it('navigates to the forgot password screen when the forgot password button is pressed', async () => {
//     const { getByTestId } = render(
//       <NavigationContainer>
//         <AuthStack />
//       </NavigationContainer>
//     );
//     fireEvent.press(getByTestId('forgot-password-link'));
//     await waitFor(() => {
//       expect(getByTestId('forgot-password-screen')).toBeTruthy();
//     });
//   });
// });

// describe('UserStack Navigation', () => {
//   it('navigates to order menu and back', async () => {
//     const { getByTestId, queryByTestId } = render(
//       <NavigationContainer>
//         <UserStack />
//       </NavigationContainer>
//     );

//     fireEvent.press(getByTestId('order-button'));
//     await waitFor(() => {
//       expect(queryByTestId('order-menu-screen')).toBeTruthy();
//     });

//     fireEvent.press(getByTestId('back-button'));
//     await waitFor(() => {
//       expect(queryByTestId('drawer-screen')).toBeTruthy();  // Assuming you have a testID in your drawer screen
//     });
//   });

//   it('places an order and navigates to order placed screen', async () => {
//     const { getByTestId, getByText, queryByTestId } = render(
//       <NavigationContainer>
//         <UserStack />
//       </NavigationContainer>
//     );

//     fireEvent.press(getByTestId('order-button'));
//     await waitFor(() => {
//       expect(queryByTestId('order-menu-screen')).toBeTruthy();
//     });

//     const placeOrderButton = getByText('First aid kit');
//     fireEvent.press(placeOrderButton);

//     const orderButton = getByText('Order');
//     fireEvent.press(orderButton);

//     await waitFor(() => {
//       expect(queryByTestId('order-placed-screen')).toBeTruthy();
//     });
//   });
// });

// import React, { ReactElement } from "react";
// import { fireEvent, render, waitFor } from "@testing-library/react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { AuthStack } from "../src/navigation/StackNavigation";
// import { UserStack } from "../src/navigation/StackNavigation";

// export const renderWithNavigation = (component: ReactElement) => {
//   return render(<NavigationContainer>{component}</NavigationContainer>);
// };

// describe("AuthStack", () => {
//   it("should render the Login screen as the first screen", () => {
//     const { getByText } = renderWithNavigation(<AuthStack />);
//     expect(getByText("Login")).toBeTruthy();
//   });

//   it("contains Login, SignUp, and ForgotPassword screens", () => {
//     const { getByText } = renderWithNavigation(<AuthStack />);
//     expect(getByText("Login")).toBeTruthy();
//     expect(getByText("SignUp")).toBeTruthy();
//     expect(getByText("ForgotPassword")).toBeTruthy();
//   });
// });

// describe("UserStack", () => {
//   it("should render the Drawer component", () => {
//     const { getByText } = renderWithNavigation(<UserStack />);
//     expect(getByText("Drawer")).toBeTruthy();
//   });

//   it("should have the OrderMenu screen with a custom header", () => {
//     const { getByTestId } = renderWithNavigation(<UserStack />);
//     expect(getByTestId("back-button")).toBeTruthy();
//   });

//   it("should have the OrderPlaced screen with a custom header", () => {
//     const { getByTestId } = renderWithNavigation(<UserStack />);
//     expect(getByTestId("back-button")).toBeTruthy();
//   });
// });

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AuthStack, UserStack } from "../src/navigation/StackNavigation";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "../__mocks__/expo-font";

describe("NavigationStacks", () => {
  //   beforeEach(() => {
  //     useFonts.mockReturnValue([true]);
  //   });
  //   test("AuthStack renders Login screen by default", () => {
  //     const { getByText } = render(
  //       <NavigationContainer>
  //         <AuthStack />
  //       </NavigationContainer>
  //     );
  //     expect(getByText("Wild")).toBeDefined();
  //   });

  test("UserStack renders Drawer screen by default", () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserStack />
      </NavigationContainer>
    );
    expect(getByText("Order")).toBeTruthy();
  });

  //   test("UserStack navigates to OrderMenu screen", () => {
  //     const { getByText, getByTestId } = render(
  //       <NavigationContainer>
  //         <UserStack />
  //       </NavigationContainer>
  //     );
  //     fireEvent.press(getByText("Order"));
  //     expect(getByText("Choose your item")).toBeDefined();
  //   });
});

// tests to add

//import React from "react";
// import { render, waitFor, fireEvent } from "@testing-library/react-native";
// import { useFonts } from "../__mocks__/expo-font";
// import * as Google from "expo-auth-session/providers/google";

// import App from "../src/app/App";
// import { onAuthStateChanged } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// beforeEach(() => {
//   const mockPromptAsync = jest.fn();
//   useFonts.mockReturnValue([true]);

//   // Mock the Google authentication request setup, makes the user sign in automatically with google
//   (Google.useAuthRequest as jest.Mock).mockReturnValue([
//     {}, // Mocked request
//     { type: "success", params: { id_token: "mock-id-token" } }, // Mocked response
//     mockPromptAsync, // Mocked promptAsync function
//   ]);
// });

// beforeAll(() => {
//   global.alert = jest.fn();

//   // Avoid useless error messages
//   jest.spyOn(console, "error").mockImplementation(() => {});
// });

// // Helper function to simulate login actions
// async function simulateLogin(
//   getByPlaceholderText: any,
//   getByTestId: any,
//   queryByTestId: any
// ) {
//   const emailInput = getByPlaceholderText("Enter your username or email");
//   const passwordInput = getByPlaceholderText("Enter your password");
//   fireEvent.changeText(emailInput, "random@gmail.com");
//   fireEvent.changeText(passwordInput, "password");
//   fireEvent.press(getByTestId("login-button"));

//   await waitFor(() => {
//     expect(queryByTestId("map-overview-screen")).toBeTruthy();
//   });
// }

// describe("App Navigation", () => {
//   it("renders the login screen as the initial route", () => {
//     const { getByTestId } = render(<App />);
//     expect(getByTestId("login-screen")).toBeTruthy();
//   });

//   it("directly logs in with Google due to the mock implementation", async () => {
//     const { queryByTestId } = render(<App />);
//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//     });
//   });

//   it("navigates to sign up screen when the sign up button is pressed", async () => {
//     const { getByText, queryByTestId, getByTestId } = render(<App />);
//     fireEvent.press(getByTestId("sign-up-link"));
//     await waitFor(() => {
//       expect(queryByTestId("sign-up-screen")).toBeTruthy();
//     });
//   });

//   it("navigates to forgot password screen when the forgot password button is pressed", async () => {
//     const { getByText, queryByTestId, getByTestId } = render(<App />);
//     const forgotPasswordButton = getByTestId("forgot-password-link");
//     fireEvent.press(forgotPasswordButton);

//     await waitFor(() => {
//       expect(queryByTestId("forgot-password-screen")).toBeTruthy();
//     });
//   });

//   it("logs in when the login button is pressed", async () => {
//     (Google.useAuthRequest as jest.Mock).mockReturnValue([
//       {},
//       { type: "fail", params: { id_token: "" } },
//       jest.fn(),
//     ]);

//     const { getByTestId, getByPlaceholderText, queryByTestId } = render(
//       <App />
//     );

//     await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);
//   });

//   it("logs in, go to map overview, and then go to order menu", async () => {
//     (Google.useAuthRequest as jest.Mock).mockReturnValue([
//       {},
//       { type: "fail", params: { id_token: "" } },
//       jest.fn(),
//     ]);

//     const { getByTestId, getByPlaceholderText, queryByTestId } = render(
//       <App />
//     );

//     await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);

//     const orderMenuButton = getByTestId("order-button");
//     fireEvent.press(orderMenuButton);

//     await waitFor(() => {
//       expect(queryByTestId("order-menu-screen")).toBeTruthy();
//     });
//   });

//   it("goes to order menu, then goes back", async () => {
//     const { getByTestId, queryByTestId } = render(<App />);

//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//     });

//     const orderMenuButton = getByTestId("order-button");
//     fireEvent.press(orderMenuButton);

//     await waitFor(() => {
//       expect(queryByTestId("order-menu-screen")).toBeTruthy();
//     });

//     const backButton = getByTestId("back-button");
//     fireEvent.press(backButton);

//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//     });
//   });

//   it("goes to order menu, place an order and then goes to order placed", async () => {
//     const { getByTestId, getByText, queryByTestId } = render(<App />);

//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//     });

//     const orderMenuButton = getByTestId("order-button");
//     fireEvent.press(orderMenuButton);

//     await waitFor(() => {
//       expect(queryByTestId("order-menu-screen")).toBeTruthy();
//     });

//     const placeOrderButton = getByText("First aid kit");
//     fireEvent.press(placeOrderButton);

//     const orderButton = getByText("Order");
//     fireEvent.press(orderButton);

//     await waitFor(() => {
//       expect(queryByTestId("order-placed-screen")).toBeTruthy();
//     });
//   });

//   it("logs in and navigates through the app", async () => {
//     const { getByPlaceholderText, getByTestId, queryByTestId } = render(
//       <App />
//     );
//     await simulateLogin(getByPlaceholderText, getByTestId, queryByTestId);

//     const orderMenuButton = getByTestId("order-button");
//     fireEvent.press(orderMenuButton);

//     await waitFor(() => {
//       expect(queryByTestId("order-menu-screen")).toBeTruthy();
//     });

//     fireEvent.press(getByTestId("back-button"));
//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//     });
//   });

//   it("onAuthStateChanged is called when the user logs in", async () => {
//     const mockUser = { uid: "123", email: "random@gmail.com" };
//     (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
//       callback(mockUser);
//       return jest.fn();
//     });

//     const { queryByTestId } = render(<App />);

//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//       expect(onAuthStateChanged).toHaveBeenCalled();
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith(
//         "@user",
//         JSON.stringify(mockUser)
//       );
//     });
//   });

//   it("onAuthChanged is called when the user logs out", async () => {
//     //mock null user (logged out)
//     const mockUser = null;
//     (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
//       callback(mockUser);
//       return jest.fn();
//     });

//     const { queryByTestId } = render(<App />);
//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//       expect(onAuthStateChanged).toHaveBeenCalled();
//       expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user");
//     });
//   });

//   it("alerts due to setItem error", async () => {
//     const mockUser = {
//       uid: "123",
//       email: "random@gmail.com",
//     };
//     (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
//       callback(mockUser);
//       return jest.fn();
//     });

//     // Mock the AsyncStorage error
//     (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
//       new Error("AsyncStorage error")
//     );

//     const { queryByTestId } = render(<App />);
//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//       expect(onAuthStateChanged).toHaveBeenCalled();
//       expect(AsyncStorage.setItem).toHaveBeenCalledWith(
//         "@user",
//         JSON.stringify(mockUser)
//       );
//       expect(alert).toHaveBeenCalledWith(new Error("AsyncStorage error"));
//     });
//   });

//   it("alerts due to removeItem error", async () => {
//     const mockUser = null;
//     (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
//       callback(mockUser);
//       return jest.fn();
//     });

//     // Mock the AsyncStorage error
//     (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(
//       new Error("AsyncStorage error")
//     );

//     const { queryByTestId } = render(<App />);
//     await waitFor(() => {
//       expect(queryByTestId("map-overview-screen")).toBeTruthy();
//       expect(onAuthStateChanged).toHaveBeenCalled();
//       expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user");
//       expect(alert).toHaveBeenCalledWith(new Error("AsyncStorage error"));
//     });
//   });

//   // Not sure how to do this test, as we don't explicitly have a Go Back button inside our SignUp, I believe it's in the Navigator
//   /*it("navigates back to login screen when the sign up back button is pressed", async () => {
//     (Google.useAuthRequest as jest.Mock).mockReturnValue([
//       {},
//       { type: "fail", params: { id_token: "" } },
//       jest.fn(),
//     ]);

//     const { getByText, getByTestId, queryByTestId } = render(<App />);
//     const signUpButton = getByTestId("sign-up-link");
//     fireEvent.press(signUpButton);

//     await waitFor(() => {
//       expect(queryByTestId("sign-up-screen")).toBeTruthy();
//     });

//     const signUpBackButton = getByTestId("sign-up-back-button");
//     fireEvent.press(signUpBackButton);

//     await waitFor(() => {
//       expect(queryByTestId("login-screen")).toBeTruthy();
//     });
//   });*/

//   it("navigates back to login screen when the forgot password back button is pressed", async () => {
//     (Google.useAuthRequest as jest.Mock).mockReturnValue([
//       {},
//       { type: "fail", params: { id_token: "" } },
//       jest.fn(),
//     ]);

//     const { getByText, getByTestId, queryByTestId } = render(<App />);
//     const forgotPasswordButton = getByTestId("forgot-password-link");
//     fireEvent.press(forgotPasswordButton);

//     await waitFor(() => {
//       expect(queryByTestId("forgot-password-screen")).toBeTruthy();
//     });

//     const forgotPasswordBackButton = getByTestId("forgot-password-back-button");
//     fireEvent.press(forgotPasswordBackButton);

//     await waitFor(() => {
//       expect(queryByTestId("login-screen")).toBeTruthy();
//     });
//   });
// });
