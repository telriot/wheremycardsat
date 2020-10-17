import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	postLogout,
	selectAuthorizedUser,
	openedAuthDialog,
	fetchAuthState,
} from "../features/auth/authSlice";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import SvgIcon from "@material-ui/core/SvgIcon";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AuthDialog from "../features/auth/AuthDialog";
import { ReactComponent as LogoutIcon } from "../assets/loginIcon24px.svg";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import Tooltip from "@material-ui/core/Tooltip";
import ViewListIcon from "@material-ui/icons/ViewList";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
		color: "#fff",
	},
	icon: { color: "#fff" },
	menuButton: { marginRight: theme.spacing(0.5) },
}));

function Navbar() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const history = useHistory();
	const user = useSelector(selectAuthorizedUser);

	const handleAddNewDeck = () => {
		history.push("/deckbuilder");
	};
	const handleGoToDecks = () => {
		history.push("/my-decks");
	};
	const handleLogin = async () => {
		dispatch(openedAuthDialog());
	};

	const handleLogout = async () => {
		await dispatch(postLogout());
		await dispatch(fetchAuthState());
		history.push("/");
	};

	const loggedInButtons = [
		{
			title: "Create Deck",
			onClick: handleAddNewDeck,
			component: <PlaylistAddIcon className={classes.icon} />,
		},
		{
			title: "My Decks",
			onClick: handleGoToDecks,
			component: <ViewListIcon className={classes.icon} />,
		},
		{
			title: "Logout",
			onClick: handleLogout,
			component: <SvgIcon component={LogoutIcon} className={classes.icon} />,
		},
	];

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						<Link to="/">WMCA</Link>
					</Typography>
					{Boolean(!user) ? (
						<Tooltip title="Login">
							<IconButton
								edge="start"
								className={classes.menuButton}
								color="inherit"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleLogin}
							>
								<ExitToAppIcon />
							</IconButton>
						</Tooltip>
					) : (
						<Box
							display="flex"
							width={`${loggedInButtons.length * 3}rem`}
							justifyContent="space-between"
						>
							{loggedInButtons.map((button) => (
								<Tooltip title={button.title}>
									<IconButton
										edge="start"
										className={classes.menuButton}
										color="inherit"
										aria-controls="menu-appbar"
										aria-haspopup="true"
										onClick={button.onClick}
										key={`loggedin-button-${button.title}`}
									>
										{button.component}
									</IconButton>
								</Tooltip>
							))}
						</Box>
					)}
				</Toolbar>
			</AppBar>
			<AuthDialog />
		</div>
	);
}

export default Navbar;
