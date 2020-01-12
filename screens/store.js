import React, { useState, useEffect } from "react";
import Storage from "./../libs/Storage";

export default function applicationHook(initState) {
  const addPalette = async palette => {
    await Storage.save({...palette});
    const allPalettes = await Storage.getAllPalettes();
    setState(state => {
      const { allPalettes } = state;
      allPalettes[palette.name] = palette;
      return { ...state, allPalettes };
    });
  };

  const loadInitPaletteFromStore = async () => {
    const allPalettes = await Storage.getAllPalettes();
    setState(state => ({ ...state, allPalettes }));
  };

  const removePaletteFromStateByName = name => {
    setState(state => {
      const { deletedPalettes } = state;
      delete deletedPalettes[name];
      return { ...state, deletedPalettes };
    });
  };

  const deletePaletteByName = async name => {
    await Storage.deletePaletteByName(name);
    setState(state => {
      const { allPalettes } = state;
      const { deletedPalettes } = state;
      if (allPalettes[name]) {
        deletedPalettes[name] = {...allPalettes[name]};
        delete allPalettes[name];
        setTimeout(() => {
          removePaletteFromStateByName(name);
        }, 3000);
        return { ...state, allPalettes, deletedPalettes };
      }
      return { ...state };
    });
  };

  const undoDeletionByName = name => {
    setState( state => {
      const { deletedPalettes } = state;
      if (deletedPalettes[name]) {
        addPalette({...deletedPalettes[name]})
        removePaletteFromStateByName(name);
      }
      return { ...state };
    });
  };

  const [state, setState] = useState({
    ...initState,
    loadInitPaletteFromStore,
    undoDeletionByName,
    deletePaletteByName,
    addPalette
  });
  console.log(state, "updated state ");
  return state;
}
