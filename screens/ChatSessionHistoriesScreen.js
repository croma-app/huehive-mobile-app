import { ScrollView, StyleSheet, Text } from 'react-native';
import React from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';

const ChatSessionHistoriesScreen = () => {
  logEvent('chat_session_histories_screen');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text>Hello.....</Text>
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
    textAlign: 'justify'
  },
  icon: {
    fontSize: 40,
    color: 'black'
  },
  linksMainView: {
    paddingVertical: 15
  },
  linkView: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center'
  },
  link: {
    fontSize: 14,
    color: 'blue'
  }
});

export default ChatSessionHistoriesScreen;
