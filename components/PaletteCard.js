import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Card from './Card';
import * as Colors from '../constants/Colors';

export class PaletteCard extends React.Component {
  
  render() {
    return (
      <Card {...this.props}>
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