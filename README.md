# Knight

[![codecov](https://codecov.io/gh/KnightDrone/Knight/graph/badge.svg?token=BDIWQF7QIC)](https://codecov.io/gh/KnightDrone/Knight)

Knight is a React Native app developed for our CS-311 (Software Enterprise) class at EPFL. It functions as the Uber for hikers, enabling the delivery of essential items like first aid kits. Whether hikers have run out, forgotten theirs, or simply prefer to carry less, Knight ensures they have access to the necessities they need while on the trail.

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

### Push Notifications

To receive push notifications, you need to test on a real device. Also, they're available only for Android as of now.

### Documentation

For more information on the project, please refer to the CONTRIBUTING.md file in this directory. You can also look at the architecture.

![Architecture](./architecture_diagram.png)
