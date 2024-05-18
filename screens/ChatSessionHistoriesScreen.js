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
import ActionButton from 'react-native-action-button';
import Colors from '../constants/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Spacer from '../components/Spacer';
import Color from 'pigment/full';
import useAuth from '../hooks/useAuth';
import useUserData from '../hooks/useUserData';

function extractColorsFromChatSession(session) {
  if (session.messages) {
    return Color.parse(
      session.messages
        .map((message) => {
          return message.message;
        })
        .join(' ')
    ).map((colorObj) => colorObj.tohex());
  } else {
    return [];
  }
}

const ChatSessionColorPreview = ({ colors }) => {
  const maxColors = 8;
  const displayedColors = colors.slice(0, maxColors);
  const remainingColors = colors.length - maxColors;

  return (
    <View style={styles.colorPreviewContainer}>
      <View style={styles.colorContainer}>
        {displayedColors.map((color, index) => (
          <View key={index} style={[styles.colorCircle, { backgroundColor: color }]} />
        ))}
        {remainingColors > 0 && (
          <View style={styles.moreColorsContainer}>
            <Text style={styles.moreColorsText}>+{remainingColors}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const ChatSessionHistoriesScreen = () => {
  logEvent('chat_session_histories_screen');
  const navigation = useNavigation();

  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openAuthOverlay } = useAuth();
  const { userData } = useUserData();

  useEffect(() => {
    if (!userData) {
      openAuthOverlay();
    }
  }, [openAuthOverlay, userData]);

  useEffect(() => {
    const fetchChatSessions = async () => {
      const sessions = await getChatSessions();
      setChatSessions(sessions.data);
      setLoading(false);
    };

    fetchChatSessions();
  }, []);

  if (!userData) {
    return (
      <Text style={styles.noChatSessionMessage}>
        No chat sessions yet. Start a new one by clicking the action button.
      </Text>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            {chatSessions.length === 0 && (
              <Text style={styles.noChatSessionMessage}>
                No chat sessions yet. Start a new one by clicking the action button.
              </Text>
            )}
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
                    <View style={styles.metaContainer}>
                      <Text style={styles.updatedAt}>
                        {moment(session.updated_at).format('MMMM D, YYYY')}
                      </Text>
                      <Text style={styles.messageCount}>{session.messages.length} messages</Text>
                    </View>
                  </View>
                </View>
                {<ChatSessionColorPreview colors={extractColorsFromChatSession(session)} />}
              </TouchableOpacity>
            ))}
          </>
        )}
        <Spacer />
      </ScrollView>
      <ActionButton
        offsetY={76}
        bgColor="rgba(68, 68, 68, 0.6)"
        fixNativeFeedbackRadius={true}
        buttonColor={Colors.primaryDark}
        onPress={() => {
          logEvent('add_chat_session_fab');
          navigation.navigate('ChatSession');
        }}
        renderIcon={() => <FontAwesome5 name="magic" size={20} color="white" />}
        style={styles.actionButton}
      />
    </>
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
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  updatedAt: {
    ...material.caption,
    color: '#888',
    marginRight: 8
  },
  messageCount: {
    ...material.caption,
    color: '#888'
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
  },
  actionButton: {},
  noChatSessionMessage: {
    ...material.headline,
    textAlign: 'center',
    marginTop: 100
  },
  colorPreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4
  },
  moreColorsContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4
  },
  moreColorsText: {
    fontSize: 10,
    color: '#757575'
  }
});

export default ChatSessionHistoriesScreen;
