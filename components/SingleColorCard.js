import * as React from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import Card from './Card';
import Colors from '../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class SingleColorCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { animationType: 'fadeInLeftBig' };
  }
  render() {
    return (
      <Card {...this.props} animationType={this.state.animationType}>
        <View>
          <View style={{ backgroundColor: this.props.color.color, height: 100 }} />
          <View style={styles.bottom}>
            <Text style={styles.label}>
              {this.props.color.color +
                (this.props.color.name ? ' (' + this.props.color.name + ')' : '')}
            </Text>
            <View style={styles.actionButtonsView}>
              <TouchableOpacity
                {...{
                  [Platform.OS === 'web' ? 'onClick' : 'onPress']: (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.setState({ animationType: 'fadeOutRightBig' });
                    setTimeout(() => {
                      this.props.colorDeleteFromPalette();
                    }, 400);
                  }
                }}
                style={styles.actionButton}
              >
                <FontAwesome size={20} name="trash" />
              </TouchableOpacity>
            </View>

            <View style={styles.actionButtonsView}>
              <TouchableOpacity onPressIn={this.props.onPressDrag}>
                <MaterialIcons style={{ alignItems: 'center' }} size={20} name="drag-indicator" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 54
  },
  actionButtonsView: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  actionButton: {
    paddingRight: 16
  },
  label: {
    flex: 1,
    marginHorizontal: 4,
    fontWeight: '500',
    color: Colors.darkGrey
  }
});
