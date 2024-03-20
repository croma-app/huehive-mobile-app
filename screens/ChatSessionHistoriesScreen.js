import { ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';
import { getChatSessions } from '../network/chat_session';

const ChatSessionHistoriesScreen = () => {
  logEvent('chat_session_histories_screen');
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatSessions = async () => {
      const sessions = await getChatSessions();
      setChatSessions(sessions.data);
      setLoading(false);
    };

    fetchChatSessions();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <>
          {chatSessions.map((session, index) => (
            <Text key={index} style={styles.line}>
              {session.messages.length > 0 ? session.messages[0].message : 'Untitled'}
            </Text>
          ))}
        </>
      )}
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
