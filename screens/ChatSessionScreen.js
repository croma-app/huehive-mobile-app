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

const ChatSessionScreen = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    // Logic to send the message
    const newMessage = {
      text: inputText,
      sender: 'user' // or 'ai' for AI messages
    };
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  logEvent('chat_session_screen');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        {/* Render the messages */}
        {messages.map((message, index) => (
          <Text key={index} style={styles.message}>
            {message.text}
          </Text>
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
