import React, { useState, useEffect } from "react";
import Storage from "./../libs/Storage";

export default function applicationHook(initState) {
  const addPalette = async palette => {
    await Storage.save(palette);
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
      let { deletedPalettes } = state;
      delete deletedPalettes[name];
      return { ...state, deletedPalettes };
    });
  };

  const deletePaletteByName = name => {
    setState(state => {
      const { allPalettes } = state;
      const { deletedPalettes } = state;
      if (allPalettes[name]) {
        deletedPalettes[name] = allPalettes[name];
        delete allPalettes[name];
        setTimeout(() => {
          removePaletteFromStateByName(name);
          Storage.deletePaletteByName(name);
        }, 3000);
        return { ...state, allPalettes, deletedPalettes };
      }
      return { ...state };
    });
  };

  const undoDeletionByName = name => {
    setState(async state => {
      const { deletedPalettes, allPalettes } = state;
      if (deletedPalettes[name]) {
        const palette = {};
        palette[name] = deletedPalettes[name];
        await Storage.save(palette);
        allPalettes[name] = deletedPalettes[name];
        this.removePaletteFromStateByName(name);
      }
      return { allPalettes };
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
