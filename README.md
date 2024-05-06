# Knight

[![codecov](https://codecov.io/gh/KnightDrone/Knight/graph/badge.svg?token=BDIWQF7QIC)](https://codecov.io/gh/KnightDrone/Knight)

## Development Setup

1. Install Expo Go on your phone (you can download from the App Store or Google Play)
2. Install Node.js and NPM on your computer [here](https://nodejs.org/en/download/)
3. Install dependencies by running `npm install` in this directory
4. Start the development server by running `npm run start`
5. Use your phone to scan the QR code printed in the terminal
6. Enjoy! You can now see the app on your phone and make changes to the code in this directory to see them reflected in real time (save the file to see the changes).

> **Note:**  
> For macOS users, you can use XCode to run the app on the iOS simulator. To do this, run `npm run ios` instead of `npm run start` in step 4. Make sure you have XCode and the XCode CLI tools installed on your computer. To install XCode, download it from the App Store, then open the app and press `Command + ,` to open the preferences. Go to the Locations tab and install the CLI tools. See more information [here](https://docs.expo.dev/workflow/ios-simulator/).

> **Warning:**
> The app may not work as expected due to the folder structure. If you encounter any issues, please let me know. To fix the issue, you may need to update the code of the file `node_modules/expo/AppEntry.js` to the following: (the node_modules is generated after running `npm install`):
>
> ```javascript
> import registerRootComponent from "expo/build/launch/registerRootComponent";
> import App from "../../src/app/App"; // Change this line to the correct path
>
> registerRootComponent(App);
> ```

### Setup

To run the tests, execute the command `npm run test` in this directory. This will run the tests in the `__tests__` directory.  
To run the tests in watch mode, execute `npm run test:watch`. This will run the tests in the `__tests__` directory and watch for changes to the files. If you save a file, the tests will automatically run again.  
To run a specific test file, execute `npm run test <file-name>`. For example, to run the tests in `__tests__/App.test.js`, execute `npm run test App.test.js`.  
Additionally, you can run `npm run test:coverage` to view the test coverage of the app. The coverage report is available in the `coverage` directory, and `npm run test` also produces a coverage report.

### Writing Tests

To write tests, create a new file in the `__tests__` directory. Name the file after the file you want to test but append `.test.js` to the end. For example, to test `App.js`, create a file named `App.test.js`. Within this file, you can write tests using the Jest testing framework. Refer to the Jest documentation [here](https://jestjs.io/docs/getting-started) for guidance on how to write tests.  
For more information on how to test React components, consult the React Testing Library documentation [here](https://testing-library.com/docs/react-testing-library/intro/), with practical examples available [here](https://testing-library.com/docs/react-native-testing-library/example-intro).

### Navigation

For navigation we use the react-navigation library, which is setup in the navigation directory in the StackNavigation.tsx file. To be able to access a different screen one must go to the RootStackParamList type and add the name of the Screen and it's parameter.

`src/types/RootStackParamList.tsx`

```javascript
Map: undefined;
OrderPlaced: {
  orderedItem: Item;
  placedAt: number;
  userLocation: string;
}
```

If the screen doesn't take any parameters then we write it as undefined. We then add it to the Stack Navigator. eg.

`src/navigation/StackNavigation.tsx`

```javascript
<Screen name="ForgotPassword" component={ForgotPassword} />
```

if the screen takes parameters then we write it as follows:

`src/navigation/StackNavigation.tsx`

```javascript
  <Screen name="OrderPlaced">
    {(props: any) => <OrderPlaced {...props} />}
  </Screen>
```

if your screen requires a back button there is a simple template we have been using for all the components here is an example of how it would look on the ForgotPassword screen:

```javascript
  <Screen
    name="ForgotPassword"
    component={ForgotPassword}
    options={({ navigation }: any) => ({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => navigation.navigate("Login")}
          labelVisible={false}
          testID="forgot-password-back-button"
        />
      ),
    })}
  />
```

Don't forget to add the proper testID!!

Note 1: You want to add the screen to the correct group so that it is properly organised in the correct segment.

Note 2: Don't forget to import the component to the `src/navigation/StackNavigation.tsx` file.

For more information on how to use the react-navigation libray here are some links: -[React Navigation](https://reactnavigation.org/docs/getting-started) -[Using Typescript with React Navigation](https://react.dev/learn/typescript)

### Firestore Manager

The `FirestoreManager` class provides methods to interact with the Firestore database. Here's how you can use these methods:

#### readOrder(id: string): Promise<any | null>

This method reads data from the Firestore database by a given document id. It returns a Promise that resolves to the data of the document if it exists, or `null` if it doesn't.

```typescript
const firestoreManager = new FirestoreManager();
const data = await firestoreManager.readOrder("documentId");
```

#### queryOrder(field: string, data: string): Promise<Order[] | null>

This method queries data from the Firestore database based on a field and its value. It returns a Promise that resolves to an array of `Order` objects if any are found, or `null` if none are found.

You can query for the following fields:

- user
- status
- item name

```typescript
const firestoreManager = new FirestoreManager();
const orders = await firestoreManager.queryOrder("user", "username");
```

#### writeOrder(order: Order): Promise<void>

This method writes a specific `Order` object to the Firestore database. It returns a Promise that resolves when the write operation is complete.

```typescript
const firestoreManager = new FirestoreManager();
await firestoreManager.writeOrder(order);
```

#### deleteOrder(orderId: string): Promise<void>

This method deletes a document with a specific id from the Firestore database. It returns a Promise that resolves when the delete operation is complete.

```typescript
const firestoreManager = new FirestoreManager();
await firestoreManager.deleteOrder("orderId");
```

#### updateOrder(orderId: string, field: string, data: string | Date | OrderLocation): Promise<void>

This method updates a specific field of a document in the Firestore database. It returns a Promise that resolves when the update operation is complete.

You can update the following fields:

- operator
- status
- delivery date
- location

```typescript
const firestoreManager = new FirestoreManager();
await firestoreManager.updateOrder("orderId", "fieldName", "newData");
```

### Architecture Diagram

![](arch_diag.png)
