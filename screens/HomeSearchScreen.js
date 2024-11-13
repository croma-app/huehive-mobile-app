import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Text,
  ImageBackground
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Styles';
import React, { useState, useEffect, useRef } from 'react';
import { material } from 'react-native-typography';
import { logEvent } from '../libs/Helpers';
import useApplicationStore from '../hooks/useApplicationStore';
import GridActionButton from '../components/GridActionButton';
import AdBanner from '../components/AdBanner';

const bgImage = require('../assets/images/colorful_background.jpg');

const ChatSessionScreen = (props) => {
  const { navigation } = props;
  const [userQuery, setUserQuery] = useState('');
  const scrollViewRef = useRef();
  const { pro } = useApplicationStore();

  useEffect(() => {
    logEvent('chat_session_follow_up_screen');
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={bgImage} style={styles.backgroundImage}>
        <View style={styles.bgImageOpecity}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.chat_container}
            showsVerticalScrollIndicator={false}>
            <View style={styles.searchContainer}>
              <Text style={styles.searchTitle}>Welcome to HueHive AI!</Text>
              <Text style={styles.searchSubtitle}>
                Create a color palette using AI or explore various methods to extract a color
                palette.
              </Text>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.input}
                  value={userQuery}
                  onChangeText={setUserQuery}
                  placeholder="Generate a Barbie movie color palette."
                />
                <TouchableOpacity
                  disabled={userQuery.trim() === ''}
                  onPress={() => {
                    navigation.navigate('ChatSession', { userQuery: userQuery });
                  }}
                  style={
                    userQuery.trim() === '' ? styles.disableGenerateButton : styles.generateButton
                  }>
                  <Text style={styles.textGenerate}> Generate </Text>
                  <FontAwesome
                    name="magic"
                    color={'white'}
                    size={22}
                    style={{ marginTop: 4 }}></FontAwesome>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          {Platform.OS == 'android' && <AdBanner plan={pro.plan} />}
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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 15,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    width: '100%',
    height: 40,
    fontSize: 16
  },
  generateButton: {
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  disableGenerateButton: {
    padding: 7,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'gray',
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  textGenerate: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default ChatSessionScreen;
