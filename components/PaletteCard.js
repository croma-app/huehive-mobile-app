import * as React from 'react';
import { StyleSheet, TouchableNativeFeedback, View, Text } from 'react-native';
import Card from './Card';
import * as Colors from '../constants/Colors';

export class PaletteCard extends React.Component {
  
  render() {
    //console.log("Props:=============" + JSON.stringify(this.props));
   

    return (
      <Card {...this.props}>
        <TouchableNativeFeedback onPress={this.props.onPress}>
          <View>
            <View style={styles.palette}>
              {this.props.colors.map(item => (
                <View
                  style={[styles.color, { backgroundColor: item.color }]}
                  key={item.color}
                />
              ))}
            </View>
            <View style={styles.bottom}>
              <Text style={styles.label}>{this.props.name}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  palette: {
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 100,
  },
  color: {
    flex: 1,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    marginHorizontal: 16,
    color: Colors.darkGrey,
  },
});