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
import { logEvent, readRemoteConfig } from '../libs/Helpers';
import ChatCard from '../components/ChatCard';
import CromaButton from '../components/CromaButton';
import { CromaContext } from '../store/store';
import useChatSession from '../hooks/useChatSession';
import useUserData from '../hooks/useUserData';
import useAuth from '../hooks/useAuth';

// eslint-disable-next-line no-undef
const bgImage = require('../assets/images/colorful_background.jpg');
const EXAMPLE_PHRASES = [
  'Create a color palette for a kids website',
  'Design a color palette for a fashion brand',
  'Generate a color scheme for a travel website',
  'Create a color palette for a food blog',
  'Design a color scheme for a fitness app'
];
const ExamplePhrase = ({ phrase, onPress }) => (
  <TouchableOpacity onPress={() => onPress(phrase)}>
    <Text style={styles.examplePhrase}>{phrase}</Text>
  </TouchableOpacity>
);

const ChatSessionScreen = (props) => {
  const { route, navigation } = props;

  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const { isPro } = React.useContext(CromaContext);
  const { messages, isLoading, isCreatingSession, error, createSession, followUpSession } =
    useChatSession(route.params?.messages);

  const { userData, isLoading: isUserDataLoading } = useUserData();
  const { openAuthOverlay } = useAuth();
  const [canUserCreateChat, setCanUserCreateChat] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (!canUserCreateChat && !isUserDataLoading) {
        if (userData && !isPro) {
          setCanUserCreateChat(await readRemoteConfig('ai_behind_pro_version'));
        }
        if (isPro && userData) {
          setCanUserCreateChat(true);
        }
      }
    };
    fetchData();
  }, [canUserCreateChat, isPro, isUserDataLoading, userData]);

  useEffect(() => {
    if (!userData) {
      openAuthOverlay();
    }
  }, [openAuthOverlay, userData]);

  useEffect(() => {
    logEvent('chat_session_screen');
  }, []);

  const handleSendMessage = async () => {
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
    if (messages.length === 0) {
      logEvent('chat_session_create');
      await createSession(message);
    } else {
      logEvent('chat_session_follow_up');
      await followUpSession(messages[0].chat_session_id, message);
    }
    setInputText('');
    scrollViewRef.current.scrollToEnd({ animated: true });
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
                      {EXAMPLE_PHRASES.map((phrase, index) => (
                        <ExamplePhrase key={index} phrase={phrase} onPress={setInputText} />
                      ))}
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
              </ScrollView>
              {error && (
                <View style={styles.errorMessageContainer}>
                  <Text style={styles.errorMessageTitle}>Error: </Text>
                  <Text style={styles.errorMessageText}>{error}</Text>
                </View>
              )}
              <ActivityIndicator animating={isLoading} size="large" color="#ff7875" />
              {canUserCreateChat ? (
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
                    onPress={handleSendMessage}
                    style={
                      isLoading || inputText.trim() === ''
                        ? styles.disableSendButton
                        : styles.sendButton
                    }>
                    <Text style={styles.textSend}> Send </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <CromaButton
                  style={{ backgroundColor: '#ff5c59', margin: 10 }}
                  textStyle={{ color: '#fff' }}
                  onPress={() => {
                    logEvent('chat_session_pro_button');
                    navigation.navigate('ProVersion');
                  }}>
                  Unlock pro to use this feature
                </CromaButton>
              )}
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
  },
  errorMessageContainer: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#ff5c59',
    borderRadius: 8
  },
  errorMessageText: {
    color: 'white',
    padding: 5
  },
  errorMessageTitle: {
    color: 'white',
    paddingLeft: 5,
    paddingRight: 5
  }
});

export default ChatSessionScreen;
