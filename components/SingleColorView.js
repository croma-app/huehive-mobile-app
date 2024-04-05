import * as React from 'react';
import { Platform, StyleSheet, Text, Clipboard, TouchableOpacity } from 'react-native';
import { notifyMessage } from '../libs/Helpers';

export class SingleColorView extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          if (Platform?.OS === 'android' || Platform.OS === 'ios') {
            notifyMessage(this.props.color.color + ' copied to clipboard!');
          }
          Clipboard.setString(this.props.color.color);
        }}
        onLongPress={this.props.drag}
        style={[styles.container, { backgroundColor: this.props.color.color }]}>
        <Text style={styles.colorText}>
          {this.props.color.color +
            (this.props.color.name ? ' (' + this.props.color.name + ')' : '')}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorText: {
    fontWeight: '700',
    backgroundColor: 'rgba(255, 255, 255, .3)',
    paddingLeft: 8,
    paddingRight: 8
  }
});
