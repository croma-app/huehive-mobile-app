import {
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';
import { getChatSessions } from '../network/chat_session';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const ChatSessionHistoriesScreen = () => {
  logEvent('chat_session_histories_screen');
  const navigation = useNavigation();

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
            <TouchableOpacity
              onPress={() => navigation.navigate('ChatSession', { messages: session.messages })}
              key={index}
              style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.messageContainer}>
                  <Text style={styles.message}>
                    {session.messages.length > 0 ? session.messages[0].message : 'Untitled'}
                  </Text>
                  <Text style={styles.updatedAt}>{moment(session.updated_at).format('MMMM D, YYYY')}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{'>'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  messageContainer: {
    flex: 1
  },
  updatedAt: {
    ...material.caption,
    color: '#888',
    marginTop: 4
  },
  message: {
    ...material.body1,
    fontSize: 16,
    color: '#333'
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    ...material.body1,
    fontSize: 16,
    color: '#888'
  }
});

export default ChatSessionHistoriesScreen;