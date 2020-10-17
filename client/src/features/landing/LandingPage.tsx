import React from "react";
import { useDispatch } from "react-redux";
import { openedAuthDialog } from "../auth/authSlice";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

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
		icon: { fontSize: "8rem", color: theme.palette.secondary.light },
	})
);
function LandingPage() {
	const classes = useStyles();
	const dispatch = useDispatch();
	const handleLogin = async () => {
		dispatch(openedAuthDialog());
	};

	const actionBoxes = [
		{
			icon: <PlaylistAddIcon className={classes.icon} />,
			text: "Import or create your decks",
		},
		{
			icon: <ViewListIcon className={classes.icon} />,
			text: "Explore their contents and see what they share",
		},
		{
			icon: <SwapHorizIcon className={classes.icon} />,
			text: "Move your cards around without worries",
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
					>
						<div>
							<Typography variant="h2" paragraph>
								Keep track of your cards though multiple decks
							</Typography>
							<Typography variant="h5" paragraph>
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
						<Box
							display="flex"
							flexDirection="column"
							justifyContent="space-around"
							alignItems="center"
							padding={3}
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
