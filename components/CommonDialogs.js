import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Colors from '../constants/Styles';

export const DialogContainer = (props) => (
  <View style={styles.DialogContainer}>{props.children}</View>
);

DialogContainer.propTypes = {
  children: PropTypes.children
};

export const UndoDialog = (props) => {
  /*
    Todo - need to add deletion based on type
  */
  const { name, undoDeletion } = props;
  const { t } = useTranslation();

  return (
    <Animatable.View
      animation={'fadeInUpBig'}
      duration={500}
      style={[styles.undoCard, styles.marginAndRadius]}
      useNativeDriver={true}>
      <View>
        <Text style={styles.undoText}>
          {t('Deleted')} {name}.
        </Text>
      </View>
      <TouchableOpacity
        onPress={(event) => {
          event.stopPropagation();
          event.preventDefault();
          undoDeletion();
        }}>
        <Text style={styles.undoButton}> {t('UNDO')} </Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

UndoDialog.propTypes = { name: PropTypes.string, undoDeletion: PropTypes.func };

export const TextDialog = (props) => (
  <Animatable.View
    animation={'fadeInUp'}
    duration={500}
    useNativeDriver={true}
    style={styles.undoCard}>
    <View>
      <Text style={styles.undoText}>{props.text}</Text>
    </View>
  </Animatable.View>
);

TextDialog.propTypes = { text: PropTypes.string };

const styles = StyleSheet.create({
  undoCard: {
    backgroundColor: '#303036',
    padding: 15,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between'
  },
  marginAndRadius: {
    margin: 2,
    borderRadius: 6
  },
  undoText: {
    color: Colors.white,
    fontSize: 15
  },
  undoButton: {
    fontWeight: 'bold',
    color: '#e6be0b',
    fontSize: 15
  },
  DialogContainer:
    Platform.OS === 'web'
      ? {
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: Math.min(Dimensions.get('window').width, 400) - 10,
          margin: 5,
          zIndex: 10
        }
      : {
          height: 100,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          zIndex: 10
        }
});
