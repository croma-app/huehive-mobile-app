## Croma

# referances
* https://github.com/numixproject/croma
* https://github.com/satya164/croma
* https://github.com/satya164/pigment


### Building web version
``` expo web:build ```
This will generate web-build directory. Relative path does not work with this so you have to host it in the root. 
### Building app
https://docs.expo.io/versions/latest/distribution/building-standalone-apps/
``` 
expo build:android
expo build:android -t app-bundle

```

# Expo commands
``` expo start -w ``` for starting the web version.
``` expo start -w --no-dev ``` for production version. 

### Prettier
```  prettier --write "**/*.js" ```