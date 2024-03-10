/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { extractHexColors } from '../libs/Helpers';
import { PalettePreviewCard } from './PalettePreviewCard';
import { CromaContext } from '../store/store';

const ChatCard = ({ sender, userData, message, navigation }) => {
  const { setColorList, setSuggestedName } = useContext(CromaContext);
  const colors = extractHexColors(message);
  return (
    <View style={[styles.chatCard, sender === 'user' ? { marginRight: 20 } : { marginLeft: 20 }]}>
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
      )}
    </View>
  );
};

const styles = {
  chatCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10
  },
  message: {
    flex: 1,
    textAlign: 'justify'
  },
  palettePreview: {
    flex: 1
  }
};

export default ChatCard;
