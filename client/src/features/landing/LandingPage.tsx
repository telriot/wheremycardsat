import React from 'react'
import Container from "@material-ui/core/Container"
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DeckBuilderScreen from '../deckBuilder/DeckBuilderScreen'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: { maxWidth: "48rem" },

  })
);
function LandingPage() {
    const classes=useStyles()
    return (
<DeckBuilderScreen/>
    )
}

export default LandingPage
