## [HueHive](https://huehive.co)

#### [AppStore](https://apps.apple.com/in/app/huehive-color-palette-manager/id1596763657)
#### [Playstore](https://play.google.com/store/apps/details?id=app.croma)


### Installation guide

- Installation: `yarn`
- Running on android: `yarn android`
- Running on ios: `yarn ios`

### Release

Releases are maintained using fastlane.

#### Play store(Android):

1. Create a new release in github with a new tag
2. Publish the release. This will trigger the workflow that will release it to playstore as a beta testing track.
3. Once beta testing is done promote the release to production from play store console.

#### App store(iOS):

iOS is not fully automated yet. Build it from XCode.

# References

- https://github.com/numixproject/croma
- https://github.com/satya164/croma
- https://github.com/satya164/pigment

### Contribution

Feel free to send us pull request from the open issues. If you are not sure about something please join the [discord](https://discord.com/invite/ZSBVsBqDtg) server and ask us anything.

### [Browse react native vector icons](https://oblador.github.io/react-native-vector-icons/)

### [Troubleshooting](https://github.com/croma-app/croma-react/wiki/Troubleshooting)

### [Support us](https://www.buymeacoffee.com/kamalkishor1991)

### Debugging:

Setup the react native debugger. It allows to inspect network request - https://github.com/jhen0409/react-native-debugger

To see console log
From the simulator, press (⌘+D) and press Remote JS Debugging.
This will open a resource, http://localhost:8081/debugger-ui on localhost.
From there, use the Chrome Developer tools JavaScript console to view console.log
[Stackoverflow](https://stackoverflow.com/questions/30115372/how-to-do-logging-in-react-native)

### Troubleshooting

If you don't see console logs, please check if adb is in the path
https://stackoverflow.com/questions/17901692/set-up-adb-on-mac-os-x

Keystore file '/Users/bhuwanjoshi/Desktop/work/croma-react/android/app/debug.keystore' not found for signing config 'debug'.
https://stackoverflow.com/questions/57016236/keystore-file-project-folder-android-app-debug-keystore-not-found-for-signing

IOS build issues

1. Clean Build Folder (⇧ + ⌘ + K), clean DerivedData directory, CocoaPods caches, and restart macOS
