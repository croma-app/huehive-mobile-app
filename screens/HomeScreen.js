import React from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { PaletteList } from '../components/PaletteList';
import {PaletteCard} from '../components/PaletteCard';
import { UndoCard } from '../components/UndoCard';
import Storage from '../libs/Storage';

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      deletedPalettes: {}
    };
  }

  async componentDidMount() {
    console.log("Component did mount called");
    let allPalettes = await Storage.getAllPalettes();
    this.setState({allPalettes: allPalettes, isLoading: false});
  }

  removePaletteFromStateByName = (name) => {
    let { deletedPalettes } = this.state
    delete deletedPalettes[name]
    this.setState({ deletedPalettes })
  }
  
  deletePaletteByName = (name) => {
    const { allPalettes } = this.state
    const { deletedPalettes } = this.state
    if (allPalettes[name]) {
      const updatedDeletedPatelle = {...deletedPalettes}
      updatedDeletedPatelle[name] = allPalettes[name]
      delete allPalettes[name]
      this.setState({ allPalettes, deletedPalettes: updatedDeletedPatelle }, () => {
        setTimeout(() => {
          this.removePaletteFromStateByName(name)
          Storage.deletePaletteByName(name)
        }, 3000)
      })
    }
  }

  undoDeletionByName = (name) => {
    const { deletedPalettes } = this.state
    if(deletedPalettes[name]){
      const palette = {}
      palette[name] = deletedPalettes[name]
      Storage.save(palette)
      this.removePaletteFromStateByName(name)
    }
  }

  render() {
    console.log("Render called");
    //console.log("State: " + JSON.stringify(this.state));
    if (this.state.isLoading) {
      return <ActivityIndicator />
    } else {
      return (
        <>
          <ScrollView contentContainerStyle={styles.container}>
            {Object.keys(this.state.allPalettes).map((name) => {
              console.log("name: ", name, this.state.allPalettes[name].colors);
              return <PaletteCard 
                key={name}
                colors={this.state.allPalettes[name].colors}
                name={name}
                navigation={this.props.navigation}
                deletePaletteByName={this.deletePaletteByName}
              />
            })}          
            <PaletteList navigation={this.props.navigation}/>
          </ScrollView>
          {Object.keys(this.state.deletedPalettes).map( name => {
            return <UndoCard key={name} name={name} undoDeletionByName={this.undoDeletionByName} />
          })}
        </>    
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
    margin: 8,
    justifyContent:'center',
  },
});
