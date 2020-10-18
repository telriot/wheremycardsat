import React from "react";
import { useDispatch } from "react-redux";
import { openedAuthDialog } from "../auth/authSlice";
import {
	makeStyles,
	createStyles,
	Theme,
	useTheme,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import ViewListIcon from "@material-ui/icons/ViewList";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { maxWidth: "60rem" },
		xsSubtitle: { paddingTop: theme.spacing(3) },
		icon: {
			fontSize: "8rem",
			color: theme.palette.secondary.light,
			[theme.breakpoints.down("xs")]: {
				fontSize: "3rem",
			},
		},
	})
);
function LandingPage() {
	const classes = useStyles();
	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.down("xs"));
	const dispatch = useDispatch();
	const handleLogin = async () => {
		dispatch(openedAuthDialog());
	};

	const actionBoxes = [
		{
			icon: <PlaylistAddIcon className={classes.icon} />,
			text: isXS ? "Import" : "Import or create your decks",
		},
		{
			icon: <ViewListIcon className={classes.icon} />,
			text: isXS ? "Explore" : "Explore their contents and see what they share",
		},
		{
			icon: <SwapHorizIcon className={classes.icon} />,
			text: isXS ? "Swap" : "Move your cards around without worries",
		},
	];
	return (
		<Container className={classes.container}>
			<Grid container>
				<Grid item xs={12} sm={8}>
					<Box
						display="flex"
						flexDirection="column"
						minHeight="40vh"
						justifyContent="space-around"
						alignItems="flex-start"
						mb={isXS ? 4 : 0}
					>
						<div>
							<Typography variant="h2" paragraph>
								Keep track of your cards though multiple decks
							</Typography>
							<Typography variant="h5" color="textSecondary" paragraph>
								The easiest possible way
							</Typography>
						</div>

						<Button onClick={handleLogin} variant="contained" size="large">
							Login to start tracking
						</Button>
					</Box>
				</Grid>
				<Grid item xs={12} sm={4}>
					<Paper elevation={3}>
						{isXS && (
							<Typography
								className={classes.xsSubtitle}
								variant="h5"
								align="center"
							>
								All in three steps
							</Typography>
						)}
						<Box
							display="flex"
							flexDirection={isXS ? "row" : "column"}
							justifyContent="space-around"
							alignItems="center"
							padding={isXS ? 2 : 3}
						>
							{actionBoxes.map((action, i) => (
								<Box
									display="flex"
									flexDirection="column"
									justifyContent="space-around"
									alignItems="center"
								>
									{action.icon}
									<Typography paragraph align="center">
										{action.text}
									</Typography>
								</Box>
							))}
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
}

export default LandingPage;
