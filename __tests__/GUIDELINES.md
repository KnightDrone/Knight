## How to test with mocks and navigation

- First please use .jsx for testing the RN components. It is easier to test the components with .jsx files.
- Render all the app components if you need the navigation to work. Here is an example of how to render the app components.

```jsx
import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Login from "../src/app/Login";
import ForgotPassword from "../src/app/ForgotPassword";
import SignUp from "../src/app/SignUp";
import OrderMenu from "../src/app/OrderMenu";
// any other components that you want to test
import { Text } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
const Stack = createStackNavigator();
import { useFonts } from "../__mocks__/expo-font";

useFonts.mockReturnValue([true]);

describe("test", () => {
  it("should render the app", async () => {
    const rendered = render(
      <NavigationContainer>
        <Stack.Navigator initialRouteName={"Login"}>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Map">
            {() => (
              <>
                <Text testID="map-screen">Map screen</Text>
              </>
            )}
          </Stack.Screen>
          <Stack.Screen name="ForgotPassword">{() => <></>}</Stack.Screen>
          <Stack.Screen name="SignUp">{() => <></>}</Stack.Screen>
          <Stack.Screen name="OrderMenu">{() => <></>}</Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  });
});
```

- If your component uses useEffect, you need to see this link: https://callstack.github.io/react-native-testing-library/docs/understanding-act, there are many ways to do it. We think using fake timers is a good way to do it.
- If you have this error `TypeError: Font.isLoaded is not a function`, you need to mock the react-native-icon most of the time.
