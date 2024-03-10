import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import { createChatSession, getChatSession } from '../network/chat_session';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import ChatCard from '../components/ChatCard';

const ChatSessionScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userData, setUserData] = useState();
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
      const chatSession = await createChatSession(message);
      setMessages([...messages, ...chatSession.data.messages]);
      const interval = setInterval(async () => {
        const messageResponse = await getChatSession(
          chatSession.data.id,
          chatSession.data.messages[0].id
        );
        if (messageResponse.data.length > 0) {
          console.log('messageResponse', messageResponse);
          clearInterval(interval);
          setMessages((messages) => [...messages, ...messageResponse.data]);
        }
      }, 1000);
      // setMessages([...messages, newMessage]);
      setInputText('');
    } catch (error) {
      console.error('Error sending message', error);
    }
    // setMessages([...messages, newMessage]);
    // setInputText('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chat_container} showsVerticalScrollIndicator={false}>
        <View>
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
        </View>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
        />
        <TouchableOpacity>
          <Button title="Send" onPress={handleSend} />
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
    // height: Dimensions.get('window').height,
    flex: 1,
    padding: 12
  },
  chat_container: {
    flex: 1
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
