import { AppBar, Toolbar } from "@material-ui/core";
import React from "react";

export default function Header() {
  const displayDesktop = () => {
    return <Toolbar>Hi From Desktop Header</Toolbar>;
  };
  
  return (
    <header>
      <AppBar>{displayDesktop()}</AppBar>
    </header>
  );
};