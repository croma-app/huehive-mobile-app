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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

const GITHUB_URL = "https://github.com/croma-app/croma-react";
const GITHUB_ISSUES_URL = "https://github.com/croma-app/croma-react/issues/new";

const AboutUsScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.line}>
          Croma is a simple color palette manager and color picker made for
          designers, aiming to make it quick and fun to create and share color
          palettes on the go.
        </Text>
      </View>
      <View style={styles.githubView}>
        <TouchableOpacity onPress={() => Linking.openURL(`${GITHUB_URL}`)}>
          <View style={styles.githubLinkView}>
            <MaterialCommunityIcons name="github-circle" size={40} />
            <Text style={[styles.line, styles.githubSubtitle]}>
              Find us on Github !
            </Text>
            <Text style={[styles.line, styles.githubLink]}>{GITHUB_URL}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL(`${GITHUB_ISSUES_URL}`)}
        >
          <View style={styles.githubLinkView}>
            <MaterialIcons name="feedback" size={40} />
            <Text style={[styles.line, styles.githubSubtitle]}>
              Do you have a suggestion ?
            </Text>
            <Text style={[styles.line, styles.githubLink]}>
              {GITHUB_ISSUES_URL}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

AboutUsScreen.navigationOptions = {
  title: "About Us"
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 50
  },
  line: {
    ...material.body1,
    paddingBottom: 4,
    fontSize: 15,
    textAlign: "justify"
  },
  icon: {
    fontSize: 10,
    color: "black"
  },
  githubView: {
    paddingVertical: 50
  },
  githubLinkView: {
    paddingVertical: 20,
    alignItems: "center"
  },
  githubSubtitle: {
    fontSize: 18
  },
  githubLink: {
    fontSize: 14
  }
});

export default AboutUsScreen;
