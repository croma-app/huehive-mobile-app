/* eslint-disable react/prop-types */
import React, { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { extractHexColors } from '../libs/Helpers';
import { PalettePreviewCard } from './PalettePreviewCard';
import { CromaContext } from '../store/store';
const testingMessage = `this is some text with new lines and some more text \`\`\`color_palette 1. Bubblegum Pink (#FFC6D9) - A bright and playful shade of pink that evokes memories of childhood candy and sweet treats. 2. Sunshine Yellow (#FFF17D) - A cheerful and energetic hue that brings to mind sunny days and carefree playtime. 3. Ocean Blue (#5CC8FF) - A cool and calming shade of blue that brings to mind the vast expanse of the sea and endless possibilities. 4. Grass Green (#8FEA8C) - A fresh and vibrant green that evokes the feeling of running through a lush meadow or playing in the park. 5. Black (#000000) - Black color 6. White (#FFFFFF) - White color \`\`\` text after code block some more text Model: gpt-3.5-turbo-0125 You are an expert designer. Create a color palette.
this is some text with new lines
and some more text`;
const ChatCard = ({ sender, userData, message, navigation }) => {
  const { setColorList, setSuggestedName } = useContext(CromaContext);
  const colors = extractHexColors(testingMessage);
  const tokens = testingMessage.split(/(```[\s\S]+?```)|(\n)/g);

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
          {tokens.map((token, index) => {
            if (token === '\n' || !token) return null;
            if (token.startsWith('```'))
              return (
                <>
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
                </>
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
  },
  codeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ccc',
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
