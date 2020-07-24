find app/src/main/res/ -type f -name "*node_modules*" -exec rm -f {} \;
rm app/src/main/res/drawable-mdpi/assets_images_dots.png
./gradlew clean && ./gradlew :app:bundleRelease
