/* eslint-disable react/prop-types */
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Text,
  ImageBackground
} from 'react-native';
import Colors from '../constants/Colors';
import React, { useState, useEffect, useRef } from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';
import { createChatSession, followUpChatSession, getChatSession } from '../network/chat_session';
import ChatCard from '../components/ChatCard';
import LoginScreen from './LoginScreen';
import useUserData from '../Hooks/getUserData';

// eslint-disable-next-line no-undef
const bgImage = require('../assets/images/colorful_background.jpg');

const ExamplePhrase = ({ phrase, onPress }) => (
  <TouchableOpacity onPress={() => onPress(phrase)}>
    <Text style={styles.examplePhrase}>{phrase}</Text>
  </TouchableOpacity>
);

const ChatSessionScreen = (props) => {
  const { navigation } = props;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const { userData, isUserDataLoading, getUserData } = useUserData();

  useEffect(() => {
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
        setIsCreatingSession(true);
        chatSession = await createChatSession(message);
        setIsCreatingSession(false);
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
      setIsCreatingSession(false);
    }
  };

  useEffect(() => {
    let interval;
    return () => {
      clearInterval(interval);
    };
  }, [messages]);

  if (isUserDataLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" color="#ff7875" />
      </View>
    );
  }

  if (!userData) {
    return (
      <LoginScreen
        {...props}
        signupMessage="Please sign in or sign up to use HueHive AI"
        hideWelcomeMessage={true}
        reloadScreen={getUserData}></LoginScreen>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.backgroundImage}>
        <View style={styles.bgImageOpecity}>
          {isCreatingSession ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} size="large" color="#ff7875" />
              <Text style={styles.loadingText}>Creating chat session...</Text>
            </View>
          ) : (
            <>
              <ScrollView
                ref={scrollViewRef}
                style={styles.chat_container}
                showsVerticalScrollIndicator={false}>
                {messages.length === 0 ? (
                  <View style={styles.emptyChat}>
                    <Text style={styles.emptyChatText}>
                      Welcome to HueHive AI! Start a conversation to create color palettes for your
                      next project
                    </Text>
                    <Text style={styles.emptyChatSubtext}>Here are few examples</Text>
                    <View style={styles.examplePhrasesContainer}>
                      <ExamplePhrase
                        phrase="Create a color palette for a kids website"
                        onPress={setInputText}
                      />
                      <ExamplePhrase
                        phrase="Design a color palette for a fashion brand"
                        onPress={setInputText}
                      />
                      <ExamplePhrase
                        phrase="Generate a color scheme for a travel website"
                        onPress={setInputText}
                      />
                      <ExamplePhrase
                        phrase="Create a color palette for a food blog"
                        onPress={setInputText}
                      />
                      <ExamplePhrase
                        phrase="Design a color scheme for a fitness app"
                        onPress={setInputText}
                      />
                    </View>
                  </View>
                ) : (
                  messages.map((message, index) => (
                    <ChatCard
                      sender={message.sender_type}
                      message={message.message}
                      key={index}
                      index={index}
                      navigation={navigation}
                    />
                  ))
                )}
                <ActivityIndicator animating={isLoading} size="large" color="#ff7875" />
              </ScrollView>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder={
                    messages.length == 0
                      ? 'Ex: create a color palette for kids website'
                      : 'follow up message to change the color palette'
                  }
                />
                <TouchableOpacity
                  disabled={isLoading || inputText.trim() === ''}
                  onPress={handleSend}
                  style={
                    isLoading || inputText.trim() === ''
                      ? styles.disableSendButton
                      : styles.sendButton
                  }>
                  <Text style={styles.textSend}> Send </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ImageBackground>
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
    backgroundColor: 'transparent',
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
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyChatText: {
    ...material.headline,
    textAlign: 'center',
    marginBottom: 10
  },
  emptyChatSubtext: {
    ...material.body1,
    textAlign: 'center',
    marginBottom: 10
  },
  emptyChatExample: {
    ...material.body1,
    textAlign: 'center',
    color: 'gray'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    ...material.body1,
    marginTop: 10
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  bgImageOpecity: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    flex: 1
  },
  examplePhrase: {
    padding: 5
  },
  sendButton: {
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8
  },
  disableSendButton: {
    padding: 8,
    backgroundColor: 'gray',
    borderRadius: 8
  },
  textSend: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default ChatSessionScreen;
