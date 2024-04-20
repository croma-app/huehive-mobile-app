/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import {} from '../network/login-and-signup';
import CromaButton from './CromaButton';

const ForgetPassword = function ({ setScreenLogin }) {
  const [email, setEmail] = useState('');

  const { t } = useTranslation();
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  const onForgetPassword = async () => {
    setIsLoginInProgress(true);
    try {
      //  TODO - let handle this later
    } catch (error) {
      console.log(error);
      // TODO - Need to add a generic error screen
    } finally {
      setIsLoginInProgress(false);
    }
  };

  return (
    <View style={[styles.container]}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder={'Email address'}
        value={email}
      />
      <View>
        <View style={styles.buttonsContainer}>
          <CromaButton style={styles.buttonLeft} onPress={onForgetPassword}>
            {isLoginInProgress ? 'loading...' : t('Forget password')}
          </CromaButton>
          <CromaButton style={styles.buttonRight} onPress={setScreenLogin}>
            {t('Back')}
          </CromaButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 10
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonLeft: {
    backgroundColor: '#ff5c59',
    color: '#fff',
    flex: 1,
    marginRight: 10
  },
  buttonRight: {
    backgroundColor: '#fff',
    color: '#000',
    borderColor: '#ff5c59',
    borderWidth: 1,
    flex: 1,
    marginLeft: 10
  },
  forgotPassword: {
    marginLeft: 'auto'
  },
  separator: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  separatorLine: {
    width: 100,
    height: 1,
    backgroundColor: '#000'
  },
  separatorText: {
    marginLeft: 50,
    marginRight: 50,
    textAlign: 'center'
  }
});

export default ForgetPassword;
