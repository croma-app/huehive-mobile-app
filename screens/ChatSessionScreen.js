/* eslint-disable react/prop-types */
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
  Text,
  ImageBackground,
  Platform,
} from 'react-native';
import Colors from '../constants/Styles';
import React, { useState, useEffect, useRef } from 'react';
import { material } from 'react-native-typography';
import { logEvent, planLabels } from '../libs/Helpers';
import ChatCard from '../components/ChatCard';
import CromaButton from '../components/CromaButton';
import useChatSession from '../hooks/useChatSession';
import useApplicationStore from '../hooks/useApplicationStore';
import GridActionButton from '../components/GridActionButton';
import AdBanner from '../components/AdBanner';  // Import the new AdBanner component

const bgImage = require('../assets/images/colorful_background.jpg');

const ChatSessionScreen = (props) => {
  const { route, navigation } = props;
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();
  const { pro } = useApplicationStore();
  const { messages, isLoading, isCreatingSession, error, createSession, followUpSession } =
    useChatSession(route.params?.messages);

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

  function showUnlockPro() {
    return pro.plan === 'starter' && messages.length >= 2;
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
                  <View style={styles.searchContainer}>
                    <Text style={styles.searchTitle}>
                      Welcome to HueHive AI!
                    </Text>
                    <Text style={styles.searchSubtitle}>
                      Start by generating a color palette for your next project.
                    </Text>
                    <View style={styles.searchInputContainer}>
                      <TextInput
                        style={styles.input}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder='Create a color palette for...'
                      />
                      <TouchableOpacity
                        disabled={inputText.trim() === ''}
                        onPress={handleSendMessage}
                        style={
                          inputText.trim() === '' ? styles.disableGenerateButton : styles.generateButton
                        }>
                        <Text style={styles.textGenerate}> Generate </Text>
                      </TouchableOpacity>
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
              
              {!showUnlockPro() && messages.length > 0 && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Follow up to refine the palette"
                  />
                  <TouchableOpacity
                    disabled={isLoading || inputText.trim() === ''}
                    onPress={handleSendMessage}
                    style={
                      isLoading || inputText.trim() === '' ? styles.disableSendButton : styles.sendButton
                    }>
                    <Text style={styles.textSend}> Send </Text>
                  </TouchableOpacity>
                </View>
              )}
              
              {showUnlockPro() && (
                <CromaButton
                  style={{ backgroundColor: Colors.primary, margin: 10 }}
                  textStyle={{ color: Colors.white }}
                  onPress={() => {
                    logEvent('chat_session_pro_button');
                    navigation.navigate('ProVersion', { highlightFeatureId: 10 });
                  }}>
                  Get {planLabels['pro']} : Unlock unlimited follow-ups!
                </CromaButton>
              )}
            </>
          )}
          
          { messages.length < 2 && Platform.OS == 'android' && <AdBanner plan={pro.plan} />}

        </View>
      </ImageBackground>
      <GridActionButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#d6e4ff',
    flex: 1
  },
  chat_container: {
    flex: 1,
    padding: 5
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
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  searchTitle: {
    ...material.headline,
    textAlign: 'center',
    marginBottom: 10
  },
  searchSubtitle: {
    ...material.body1,
    textAlign: 'center',
    marginBottom: 20
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
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
  generateButton: {
    padding: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8
  },
  disableGenerateButton: {
    padding: 8,
    backgroundColor: 'gray',
    borderRadius: 8
  },
  textGenerate: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10
  },
  sendButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 8,
    marginLeft: 12
  },
  disableSendButton: {
    backgroundColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginLeft: 12
  },
  textSend: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  errorMessageContainer: {
    padding: 20,
    backgroundColor: 'rgba(255,0,0,0.2)',
    borderRadius: 8,
    margin: 10
  },
  errorMessageTitle: {
    fontWeight: 'bold'
  },
  errorMessageText: {
    marginTop: 5
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18
  }
});

export default ChatSessionScreen;
