import React from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAuthState } from "./features/auth/authSlice";
import {
  createMuiTheme,
  makeStyles,
  createStyles,
  responsiveFontSizes,
  Theme as AugmentedTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import grey from "@material-ui/core/colors/grey";
import Navbar from "./layout/Navbar";
import ResetCredentials from "./features/auth/ResetCredentials";
import PasswordUpdateForm from "./features/auth/PasswordUpdateForm";
import LandingPage from "./features/landing/LandingPage"

declare module "@material-ui/core/styles/createMuiTheme" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const useStyles = makeStyles((theme: AugmentedTheme) =>
  createStyles({
    container: {
      paddingTop: "1.25rem",
      [theme.breakpoints.up("sm")]: {
        paddingTop: "2.5rem",
      },
    },
  })
);
let theme = createMuiTheme({
  palette: {
    primary: {
      main: "#34BAFF",
    },
    secondary: {
      main: "#000",
      light: grey[400],
    },
  },
  typography: {
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
  },
});
theme = responsiveFontSizes(theme);

function App() {
  const classes = useStyles();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAuthState());
  });
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Route exact path="/*" component={Navbar} />
        <div className={classes.container}>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route
              exact
              path="/resetCredentials"
              component={ResetCredentials}
            />
            <Route exact path="/reset/:token" component={PasswordUpdateForm} />
          </Switch>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
