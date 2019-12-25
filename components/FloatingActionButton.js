import * as React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Colors from '../constants/Colors';

export default class FloatingActionButton extends React.Component {
  render() {
    return (
      <TouchableHighlight {...this.props} style={styles.container}>
        <View style={styles.fab}>
          <Icon name={this.props.icon} style={styles.icon} size={24} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    height: 56,
    width: 56,
    borderRadius: 28,
    elevation: 6,
  },
  fab: {
    backgroundColor: Colors.accent,
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  icon: {
    margin: 16,
    color: Colors.fadedBlack,
  },
});
