import { Dimensions } from "react-native";

export const HEADER_HEIGHT = 56;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
  window: {
    width,
    height
  },
  isSmallDevice: width < 375
};
