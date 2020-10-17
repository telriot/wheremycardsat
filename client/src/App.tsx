import React from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthState, selectIsAuth } from "./features/auth/authSlice";
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
import DeckBuilderScreen from "./features/deckBuilder/DeckBuilderScreen";
import DeckDetail from "./features/myDecks/DeckDetail";
import LandingPage from "./features/landing/LandingPage";
import MyDecksScreen from "./features/myDecks/MyDecksScreen";

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
	palette: {},
	typography: {},
});
theme = responsiveFontSizes(theme);

function App() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	React.useEffect(() => {
		dispatch(fetchAuthState());
	});
	return (
		<div>
			<ThemeProvider theme={theme}>
				<Route exact path="/*" component={Navbar} />
				<div className={classes.container}>
					<Switch>
						<Route
							exact
							path="/"
							component={isAuth ? MyDecksScreen : LandingPage}
						/>
						<Route exact path="/deckbuilder" component={DeckBuilderScreen} />

						<Route exact path="/my-decks" component={MyDecksScreen} />
						<Route exact path="/my-decks/:id" component={DeckDetail} />
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
