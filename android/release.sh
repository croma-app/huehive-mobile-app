find app/src/main/res/ -type f -name "*node_modules*" -exec rm -f {} \;
find app/src/main/res/ -type f -name "*constants_palettes*" -exec rm -f {} \;
rm app/src/main/res/drawable-mdpi/assets_images_dots.png
./gradlew clean && ./gradlew :app:bundleRelease
awk -F"=" 'BEGIN{OFS=FS} $1=="VERSION_CODE"{$2=$2+1}1' app/version.properties > app/version.properties.tmp && mv app/version.properties.tmp app/version.properties
