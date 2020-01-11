import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { PaletteList } from '../components/PaletteList';
import { PaletteCard } from '../components/PaletteCard';
import { UndoCard } from '../components/UndoCard';
import { Croma } from '../App';


const HomeScreen = function (props) {
  const { isLoading, allPalettes, loadInitPaletteFromStore, deletedPalettes, undoDeletionByName } = React.useContext(Croma)
  console.log('called again ', allPalettes, deletedPalettes)
  useEffect(() => {loadInitPaletteFromStore()}, []);
  if (isLoading) {
    return <ActivityIndicator />
  } else {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {Object.keys(deletedPalettes).map(name => {
          return <UndoCard key={name} name={name} undoDeletionByName={undoDeletionByName} />
        })}
        {Object.keys(allPalettes).map((name) => {
          console.log("name: ", name, allPalettes[name].colors);
          return <PaletteCard
            key={name}
            colors={allPalettes[name].colors}
            name={name}
            navigation={props.navigation}
          />
        })}
        <PaletteList navigation={props.navigation} />
      </ScrollView>
    );
  }
}

export default HomeScreen

HomeScreen.navigationOptions = {
  title: 'Croma',
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    justifyContent: 'center',
  },
});
