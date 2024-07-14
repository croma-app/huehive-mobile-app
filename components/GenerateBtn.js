import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/Styles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

const GenerateBtn = ({ onGenerateWithAI, onGenerate, currentPlan }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [buttonText, setButtonText] = useState('Generate');
  const [dropdownText, setDropdownText] = useState('Generate - AI');
  const [useAI, setUseAI] = useState(false);
  const [gradientAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false
        }),
        Animated.timing(gradientAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false
        })
      ])
    ).start();
  }, [gradientAnimation, buttonText]);

  const handlePress = () => {
    if (useAI) {
      if (currentPlan !== 'proPlus') {
        onGenerateWithAI({ canGenerate: false });
      } else {
        onGenerateWithAI({ canGenerate: true });
      }
    } else {
      onGenerate();
    }
  };

  const handleSelectAI = () => {
    if (useAI) {
      setButtonText('Generate');
      setDropdownText('Generate - AI');
      setUseAI(false);
    } else {
      setButtonText(currentPlan !== 'proPlus' ? 'Generate - AI (Pro Plus only)' : 'Generate - AI');
      setDropdownText('Generate');
      setUseAI(true);
    }
    setShowDropdown(false);
  };

  const translateX = gradientAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100]
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {showDropdown && (
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={handleSelectAI}>
              <Text style={styles.dropdownItem}>{dropdownText}</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <View style={styles.buttonContent}>
            {!useAI && <Text style={styles.buttonText}>{buttonText}</Text>}
            {useAI && (
              <>
                <View style={styles.gradientTextContainer}>
                  <Animated.View
                    style={[styles.gradientBackground, { transform: [{ translateX }] }]}>
                    <LinearGradient
                      colors={['#f7766f', '#fa8a84', '#fca8a0', '#fec3bd', '#ffd0ca']}
                      start={{ x: 0.0, y: 0.5 }}
                      end={{ x: 1.0, y: 0.5 }}
                      style={styles.gradientOverlay}
                    />
                  </Animated.View>
                  <Text style={styles.gradientText}>AI</Text>
                </View>
                <View style={styles.aiGenerateText}>
                  <Text style={styles.aiButtonText}>Generate</Text>
                  {currentPlan != 'proPlus' && (
                    <Text style={styles.aiProPlusOnlyText}>Pro Plus only</Text>
                  )}
                </View>
              </>
            )}
            <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
              <Icon
                name={showDropdown ? 'chevron-down' : useAI ? 'chevron-up' : 'magic'}
                style={styles.arrow}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  buttonContainer: {
    width: '100%'
  },
  button: {
    backgroundColor: 'white',
    padding: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  aiButtonText: {
    color: 'black'
  },
  buttonText: {
    paddingVertical: 8,
    paddingLeft: 32, // TODO: added this to center align text. Need to find a better way.
    color: 'black',
    textAlign: 'center',
    flex: 1
  },
  gradientTextContainer: {
    paddingHorizontal: 5,
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative'
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },
  gradientOverlay: {
    flex: 1
  },
  gradientText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'relative'
  },
  arrow: {
    color: 'black',
    fontSize: 16,
    padding: 8
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    position: 'absolute',
    bottom: '100%',
    marginBottom: 5,
    width: '100%',
    zIndex: 1
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    textAlign: 'center',
    fontSize: 16
  },
  aiProPlusOnlyText: {
    fontSize: 8,
    textAlign: 'center',
    color: Colors.primary
  }
});

export default GenerateBtn;
