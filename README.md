## Croma

<a href="https://apps.apple.com/app/croma-palette-manager/id1596763657"><img src='./assets/appstore-download.svg' alt="Download croma on AppStore" width="150" height="40"/></a>

<a href='https://play.google.com/store/apps/details?id=app.croma&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img width="140" height="60" alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a>

<a href='https://croma.app'>Try it on Web</a>

[![Croma DEMO](https://img.youtube.com/vi/KqrsdAuvW40/0.jpg)](https://www.youtube.com/watch?v=KqrsdAuvW40)

![](Croma_web.gif)

### Installation guide 
- Installation: `yarn`
- Running on android: `yarn android`
- Running on ios: `yarn ios`
- Release - // TODO

### Web
Currently, We are upgrading react-native and web version is available in the `web` branch with the old react-native.
https://github.com/croma-app/croma-react/tree/web

# References

- https://github.com/numixproject/croma
- https://github.com/satya164/croma
- https://github.com/satya164/pigment


Build signed apk:
`cd android`
`./release.sh`

Ref: https://reactnative.dev/docs/signed-apk-android

Bundle

`./bundle-and-run-android.sh`

### Code styling

https://github.com/google/google-java-format

https://github.com/sherter/google-java-format-gradle-plugin

https://github.com/typicode/husky

Fix java files

```

./gradlew goJF

```
### Contribution
Feel free to send us pull request from the open issues. If you are not sure about something please join the [discord](https://discord.com/invite/ZSBVsBqDtg) server and ask us anything.

### [Browse react native vector icons](https://oblador.github.io/react-native-vector-icons/)

### [Troubleshooting](https://github.com/croma-app/croma-react/wiki/Troubleshooting)

### [Support us](https://www.buymeacoffee.com/kamalkishor1991) 


### Debugging:

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
