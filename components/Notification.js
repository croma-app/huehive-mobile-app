import React from 'react';
import styled from 'styled-components/native';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { PropTypes } from 'prop-types';

const Wrapper = styled(View)`
  padding: 5px;
  background: #fdbcbc;
  width: ${Dimensions.get('window').width - 25};
  border: 1px solid red;
  display: flex;
  flex-direction: row;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  color: red;
`;

const Description = styled(Text)`
  font-size: 16;
  color: red;
`;

const MaterialCommunityIconsStyled = styled(MaterialCommunityIcons)`
  margin: 4px;
`;

const TouchableOpacityStyled = styled(TouchableOpacity)`
  margin: 4px;
  margin-left: auto;
`;

const Notification = function ({ message, onPress }) {
  return (
    <Wrapper>
      <MaterialCommunityIconsStyled name="alert-octagon" color={'red'} size={22} />
      <View>
        <Title> Error</Title>
        <Description> {message} </Description>
      </View>
      <TouchableOpacityStyled onPress={onPress}>
        <AntDesign name="close" size={25}></AntDesign>
      </TouchableOpacityStyled>
    </Wrapper>
  );
};

Notification.propTypes = {
  message: PropTypes.string,
  onPress: PropTypes.function
};

export default Notification;
