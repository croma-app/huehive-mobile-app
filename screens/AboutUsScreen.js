import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import { material } from "react-native-typography";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { logEvent } from "../libs/Helpers";

const GITHUB_URL = "https://github.com/croma-app/croma-react";
const GITHUB_ISSUES_URL = "https://github.com/croma-app/croma-react/issues/new";
const CROMA_APP_URL = "https://croma.app/";

const AboutUsScreen = () => {
  logEvent("about_us_screen");
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.line}>
          Croma is a simple color palette manager and color picker made for
          designers, aiming to make it quick and fun to create and share color
          palettes on the go.
        </Text>
      </View>
      <View style={styles.linksMainView}>
        <TouchableOpacity onPress={() => Linking.openURL(`${GITHUB_URL}`)}>
          <View style={styles.linkView}>
            <Entypo name="github-with-circle" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>
              Find us on Github !
            </Text>
            <Text style={[styles.line, styles.link]}>{GITHUB_URL}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`${GITHUB_ISSUES_URL}`)}
        >
          <View style={styles.linkView}>
            <MaterialIcons name="feedback" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>
              Do you have a suggestion ?
            </Text>
            <Text style={[styles.line, styles.link]}>{GITHUB_ISSUES_URL}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(`${CROMA_APP_URL}`)}>
          <View style={styles.linkView}>
            <MaterialCommunityIcons name="web" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>
              Lightweight web version
            </Text>
            <Text style={[styles.line, styles.subtitle]}>
              to preview and share palettes
            </Text>
            <Text style={[styles.line, styles.link]}>{CROMA_APP_URL}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  line: {
    ...material.body1,
    fontSize: 15,
    textAlign: "justify"
  },
  icon: {
    fontSize: 40,
    color: "black"
  },
  linksMainView: {
    paddingVertical: 15
  },
  linkView: {
    paddingVertical: 20,
    alignItems: "center"
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center"
  },
  link: {
    fontSize: 14
  }
});

export default AboutUsScreen;
