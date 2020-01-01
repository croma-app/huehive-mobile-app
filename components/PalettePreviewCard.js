import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Card from './Card';
import Colors from '../constants/Colors';
import MultiColorView from './MultiColorView';

export class PalettePreviewCard extends React.Component {
  
  render() {
    return (
      <Card {...this.props}>
        <View>
          <MultiColorView {...this.props}></MultiColorView>
          <View style={styles.bottom}>
            <Text style={styles.label}>{this.props.name}</Text>
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
  },
  label: {
    flex: 1,
    marginHorizontal: 16,
    color: Colors.darkGrey,
  },
});