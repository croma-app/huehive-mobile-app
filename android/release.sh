find app/src/main/res/ -type f -name "*node_modules*" -exec rm -f {} \;
./gradlew clean && ./gradlew :app:bundleRelease
