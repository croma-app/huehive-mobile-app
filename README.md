## Croma (https://croma.app)
<a href="https://bestmobileappawards.com/app-submission/croma?utm_source=badge&utm_medium=badge&utm_campaign=nominee_badge" rel="nofollow"><img src="https://bestmobileappawards.com/pub/badges/badge-platinum-award-nominee-2021.png" border="0" /></a>

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

# references

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
