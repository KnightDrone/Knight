# Research on DJI API Integration with React Native App

## Official DJI Documentation

DJI provides comprehensive SDKs for developers to create applications that interact with their drones. The DJI Mobile SDK (MSDK) supports both iOS and Android platforms, allowing developers to integrate DJI drone control and data features into their mobile apps. The SDK includes capabilities for video streaming, flight control, camera control, and access to various drone sensors.

### Key Features of DJI Mobile SDK

- **Flight Control**: Control the drone's flight including takeoff, landing, and navigation.
- **Camera Control**: Access and control the drone's camera, including capturing photos and videos.
- **Video Streaming**: Live stream video from the drone's camera to the mobile device.
- **Telemetry Data**: Access data from the drone's sensors, including GPS, battery status, and obstacle detection.

For detailed information on setting up and using the DJI Mobile SDK, you can refer to the official [DJI Developer Documentation](https://developer.dji.com/mobile-sdk/documentation/).

## Integrating DJI SDK with React Native

To integrate the DJI SDK with a React Native application, developers typically need to create custom native modules that bridge the DJI SDK functionalities to the React Native framework. This involves writing native code in Java (for Android) and Swift/Objective-C (for iOS) to interact with the DJI SDK and then exposing these functionalities to JavaScript via React Native's bridging system.

### Available React Native Wrapper: `react-native-dji-mobile`

`react-native-dji-mobile` is a React Native wrapper for the DJI Mobile SDK developed by Aerobotics. It aims to provide React Native developers with access to DJI drone functionalities through JavaScript. However, the project is still in its infancy and has several limitations.

#### Installation

To install `react-native-dji-mobile`, use the following command:

```bash
npm i --save react-native-dji-mobile
```

### iOS Setup

Using Cocoapods (recommended):

Link the library:

```bash
react-native link react-native-dji-mobile
```

Modify your Podfile:

```ruby
platform :ios, '9.0'

target '[YourProjectName]' do
  use_modular_headers!

  # Pods for [YourProjectName]
  pod 'React', :path => '../node_modules/react-native', :subspecs => [
    'Core',
    'CxxBridge', # Include this for RN >= 0.47
    'DevSupport', # Include this to enable In-App Devmenu if RN >= 0.43
    'RCTText',
    'RCTNetwork',
    'RCTWebSocket', # needed for debugging
    # Add any other subspecs you want to use in your project
  ]
  # Explicitly include Yoga if you are using RN >= 0.42.0
  pod "yoga", :path => "../node_modules/react-native/ReactCommon/yoga"

  # Third party deps podspec link
  pod 'DoubleConversion', :podspec => '../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec', :modular_headers => false
  pod 'glog', :podspec => '../node_modules/react-native/third-party-podspecs/glog.podspec', :modular_headers => false
  pod 'Folly', :podspec => '../node_modules/react-native/third-party-podspecs/Folly.podspec', :modular_headers => false

  pod 'DJIWidget', '~> 1.5', :modular_headers => false
  pod 'react-native-dji-mobile', :path => '../node_modules/react-native-dji-mobile'
end
```

Run `pod install` to ensure the required dependencies are installed.

Add Swift support to your Xcode project:

1. Open `ios/YourAppName.xcworkspace`
2. Select `File > New > File...` in Xcode's menu bar or press `CMD+N`.
3. Add a new Swift file to your project, and when asked by Xcode, press `Create Bridging Header`. Do not delete the empty swift file.

### Android Setup

### Issues with `react-native-dji-mobile`

While attempting to use `react-native-dji-mobile`, several issues were encountered:

- **Unstable Build**: Frequent build failures and compatibility issues with different React Native versions.
- **Drone Version Mismatch**: Incompatibility with certain DJI drone models and firmware versions.
- **Incomplete Features**: Many DJI SDK features are not yet available or are partially implemented in the wrapper.

## Community Insights and Third-Party Wrappers

### Stack Overflow Insights

On platforms like Stack Overflow, developers have shared their experiences and challenges with integrating DJI SDK with cross-platform frameworks such as React Native, Ionic, and Flutter. One common approach is to build custom native modules to expose DJI SDK functionalities to the JavaScript layer.

#### Example: Custom Native Modules

To create a custom native module in React Native for DJI SDK, developers need to write native code in Objective-C/Swift for iOS and Java/Kotlin for Android. Here’s an example of an Objective-C stub for a DJI waypoint mission:

```objc
@implementation RCTDJIWaypointMission

RCT_EXPORT_MODULE(DJIWaypointMission)

RCT_REMAP_METHOD(loadMission, loadMission:(NSDictionary*)mission resolver:(RCTPromiseResolveBlock)resolve rejector:(RCTPromiseRejectBlock)reject) {
  // method body
}
```

```javascript
import { NativeModules } from "react-native";
const { DJIWaypointMission } = NativeModules;

DJIWaypointMission.loadMission(mission);
```

## Conclusion

Integrating DJI SDK with React Native is a complex task that often requires the creation of custom native modules. The `react-native-dji-mobile` package provides a starting point but is still in early development and may not be suitable for production use due to stability and compatibility issues. The development of third-party wrappers for React Native is ongoing, and we can expect more robust solutions in the near future that will facilitate seamless DJI SDK integration for cross-platform applications.

## References

- [DJI Developer Documentation](https://developer.dji.com/mobile-sdk/documentation/)
- [react-native-dji-mobile GitHub Repository](https://github.com/aerobotics/react-native-dji-mobile)
- [Stack Overflow Discussion on DJI SDK Integration](https://stackoverflow.com/questions/57937715/can-i-use-dji-mobile-sdk-with-any-cross-platform-framework)
