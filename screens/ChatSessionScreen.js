import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import { createChatSession, followUpChatSession, getChatSession } from '../network/chat_session';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import ChatCard from '../components/ChatCard';

const ChatSessionScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userData, setUserData] = useState();
  const scrollViewRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const userData = await retrieveUserSession();
      if (userData) {
        setUserData(userData);
      }
    })();
    logEvent('chat_session_screen');
  }, []);

  const handleSend = async () => {
    const message = {
      chat_session: {
        chat_session_type: 'color_palette',
        messages_attributes: [
          {
            message: inputText,
            sender_type: 'user'
          }
        ]
      }
    };
    try {
      let chatSession;
      setIsLoading(true);
      if (messages.length === 0) {
        chatSession = await createChatSession(message);
      } else {
        chatSession = await followUpChatSession(messages[0].chat_session_id, message);
      }
      const latestMessage = chatSession.data.messages[chatSession.data.messages.length - 1];
      setMessages([...messages, latestMessage]);
      const interval = setInterval(async () => {
        const messageResponse = await getChatSession(chatSession.data.id, latestMessage.id);
        if (messageResponse.data.length > 0) {
          clearInterval(interval);
          setMessages((messages) => [...messages, ...messageResponse.data]);
          scrollViewRef.current.scrollToEnd({ animated: true });
          setIsLoading(false);
        }
      }, 2000);
      setInputText('');
      scrollViewRef.current.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message', error);
      setIsLoading(false);
    }
    // setMessages([...messages, newMessage]);
    // setInputText('');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.chat_container}
        showsVerticalScrollIndicator={false}>
        {messages.map((message, index) => (
          <ChatCard
            sender={message.sender_type}
            userData={userData}
            message={message.message}
            key={index}
            index={index}
            navigation={navigation}
          />
        ))}
        <ActivityIndicator animating={isLoading} size="large" color="#bae0ff" />
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
        />
        <TouchableOpacity>
          <Button title="Send" disabled={isLoading} onPress={handleSend} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#d6e4ff',
    // height: Dimensions.get('window').height,
    flex: 1
  },
  chat_container: {
    flex: 1,
    paddingTop: 10,
    padding: 5
  },
  message: {
    ...material.body1,
    fontSize: 15,
    textAlign: 'justify'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2e8',
    padding: 10,
    height: 60,
    paddingTop: 12
  },
  input: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    height: 40
  }
});
export default ChatSessionScreen;
