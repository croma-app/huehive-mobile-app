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
            <Text style={styles.label}>
              {this.props.name.substring(0, 55) + (this.props.name.length > 55 ? '...' : '')}
            </Text>
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
    minHeight: 35
  },
  label: {
    flex: 1,
    fontWeight: '500',
    fontSize: 12,
    marginHorizontal: 8,
    color: Colors.darkGrey
  }
});
