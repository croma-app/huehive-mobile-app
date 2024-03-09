import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Button
} from 'react-native';
import React, { useState } from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import { createChatSession, getChatSession } from '../network/chat_session';

const ChatSessionScreen = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  console.log('check the route is working or not ???');
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
      console.log('chat session', chatSession);
      console.log('chat session', chatSession.data.messages);
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

  logEvent('chat_session_screen');

  console.log('messages', messages);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        {messages.map((message, index) => (
          <View key={index}>
            <Text style={styles.message}>{message.message}</Text>
            <Text style={styles.message}>{message.sender_type}</Text>
          </View>
        ))}
      </View>
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
    </ScrollView>
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
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  message: {
    ...material.body1,
    fontSize: 15,
    textAlign: 'justify'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12
  },
  input: {
    flex: 1,
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8
  }
});
export default ChatSessionScreen;
