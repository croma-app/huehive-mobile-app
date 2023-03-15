import React from "react";
import styled from "styled-components/native";
import { View, Text, Dimensions } from "react-native";
// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled(View)`
  padding: 5px;
  background: papayawhip;
  width: ${Dimensions.get("window").width};
  display: flex;
`;

const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
`;

const Description = styled.Text`
  font-size: 16;
`;

const Notification = function () {
  return (
    <Wrapper>
      <Title>Title</Title>
      <Description> This is the description </Description>
    </Wrapper>
  );
};

export default Notification;
