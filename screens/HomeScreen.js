import React from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator} from 'react-native';
import { PaletteList } from '../components/PaletteList';
import {PaletteCard} from '../components/PaletteCard';
import Storage from '../libs/Storage';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isLoading: true};
  }

  componentDidMount() {
    Storage.getAllPalettes().then((allPalettes) => {
      this.setState({allPalettes: allPalettes, isLoading: false});
    });
  }

  render() {
    console.log("State: " + JSON.stringify(this.state));
    if (this.state.isLoading) {
      return <ActivityIndicator />
    } else {
      return (
        <ScrollView contentContainerStyle={styles.container}>
          {Object.keys(this.state.allPalettes).map((name) => {
            console.log("name: ", name, this.state.allPalettes[name].colors);
            return <PaletteCard colors={this.state.allPalettes[name].colors} name={name} navigation={this.props.navigation} />
          })}
          <View
            style={{
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
          />
          <PaletteList navigation={this.props.navigation} />
        </ScrollView>
      );
    }
  }
}

HomeScreen.navigationOptions = {
   title: 'Croma',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
    justifyContent:'center',
  },
});
