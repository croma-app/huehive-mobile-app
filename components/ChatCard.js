/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { extractHexColors } from '../libs/Helpers';
import { PalettePreviewCard } from './PalettePreviewCard';
import { CromaContext } from '../store/store';

const ChatCard = ({ sender, userData, message, navigation }) => {
  const { setColorList, setSuggestedName } = useContext(CromaContext);
  const colors = extractHexColors(message);
  const tokens = message.split(/(```[\s\S]+?```)|(\n)/g);

  return (
    <View
      style={[
        styles.chatCard,
        sender === 'user' ? { backgroundColor: '#fffbe6' } : { marginLeft: 20, marginRight: 10 }
      ]}>
      <View style={sender === 'user' ? styles.chatCardLeftArrow : styles.chatCardRightArrow}></View>
      <Image
        style={styles.avatar}
        source={
          sender === 'user'
            ? {
                uri: userData.avatar_url
              }
            : // eslint-disable-next-line no-undef
              require('../assets/images/icon-chatgpt.png')
        }
      />
      {sender === 'user' ? (
        <Text style={styles.message}>{message}</Text>
      ) : (
        <View style={styles.palettePreview}>
          {tokens.map((token, index) => {
            if (token === '\n' || !token) return null;
            if (token.startsWith('```'))
              return (
                <View key={index}>
                  <View style={styles.codeContainer}>
                    {token
                      .replace(/```/g, '')
                      .replace(/color_palette/g, '')
                      .split(/[0-9]\./g)
                      .map((line, index) => {
                        return (
                          <>
                            <Text style={styles.code} key={index}>
                              {index + 1}. {line}
                            </Text>
                          </>
                        );
                      })}
                  </View>
                  <PalettePreviewCard
                    onPress={() => {
                      setColorList(colors);
                      setSuggestedName('');
                      navigation.navigate('ColorList');
                    }}
                    name="Click to save"
                    colors={colors}
                  />
                </View>
              );
            return <Text key={index}>{token}</Text>;
          })}
        </View>
      )}
    </View>
  );
};

const styles = {
  chatCard: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff7e6',
    padding: 5,
    borderRadius: 10,
    position: 'relative',
    marginLeft: 10,
    marginRight: 20
  },
  chatCardLeftArrow: {
    position: 'absolute',
    width: 20,
    height: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: '#fffbe6',
    borderLeftColor: 'transparent',
    left: -10
  },
  chatCardRightArrow: {
    position: 'absolute',
    width: 20,
    height: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderTopColor: '#fff7e6',
    borderRightColor: 'transparent',
    right: -10
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 8
  },
  message: {
    flex: 1,
    textAlign: 'justify'
  },
  palettePreview: {
    flex: 1
  },
  codeContainer: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ffe7ba',
    borderRadius: 5,
    marginBottom: 10
  },
  code: {
    fontFamily: 'Courier New',
    fontSize: 14,
    lineHeight: 18,
    color: '#333'
  }
};

export default ChatCard;
