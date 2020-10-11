import React, { MouseEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	postLogout,
	selectAuthorizedUser,
	openedAuthDialog,
	fetchAuthState,
} from "../features/auth/authSlice";
import { makeStyles } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AuthDialog from "../features/auth/AuthDialog";

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
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
		null
	);
	const open = Boolean(anchorEl);

	const handleMenu = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogin = async () => {
		dispatch(openedAuthDialog());
		handleClose();
	};

	const handleLogout = async () => {
		await dispatch(postLogout());
		await dispatch(fetchAuthState());
		handleClose();
		history.push("/");
	};

	const handleMyProfile = () => {
		history.push("/my-decks");
	};

	const loggedMenuItems = [
		{ title: "Logout", link: null, action: handleLogout },
	];

	return (
		<div className={classes.root}>
			<AppBar position="static">
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						<Link to="/">WMCA</Link>
					</Typography>
					{user && (
						<IconButton
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleMyProfile}
						>
							<AccountCircleIcon className={classes.icon} />
						</IconButton>
					)}
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleMenu}
					>
						<MenuIcon className={classes.icon} />
					</IconButton>
					<Menu
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						keepMounted
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						open={open}
						onClose={handleClose}
					>
						{Boolean(user) ? (
							loggedMenuItems.map((item, index) => (
								<MenuItem key={`menuitem-${index}`} onClick={item.action}>
									{item.link ? (
										<Link to={item.link || "/"}>{item.title}</Link>
									) : (
										item.title
									)}
								</MenuItem>
							))
						) : (
							<MenuItem onClick={handleLogin}>Login</MenuItem>
						)}
					</Menu>
				</Toolbar>
			</AppBar>
			<AuthDialog />
		</div>
	);
}

export default Navbar;
