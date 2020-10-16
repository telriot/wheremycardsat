import React from "react";
import {
	IDeck,
	IRouteParams,
	ICard,
	TSortOrder,
} from "../../declarations/index";
import { sortCardsByParam } from "../../lib/helpers";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthorizedUser } from "../auth/authSlice";
import { fetchMyDecks, selectMyDecks, selectOnlyShared } from "./myDecksSlice";
import {
	createStyles,
	makeStyles,
	Theme,
	useTheme,
	withStyles,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeckDetailTableRow from "./DeckDetailTableRow";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import StyledTableCell from "../../components/StyledTableCell";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: { marginBottom: theme.spacing(3) },
		table: {
			minWidth: 320,
		},
		setterCell: {
			color: theme.palette.primary.main,
			cursor: "pointer",
			transition: "color .15s",
			minWidth: "7rem",
			"&:hover, &:focus": {
				color: theme.palette.primary.dark,
			},
		},

		iconButton: { padding: "1px" },
	})
);
function DeckDetailTable({ deck }: { deck: IDeck }) {
	const classes = useStyles();
	const theme = useTheme();
	const isXS = useMediaQuery(theme.breakpoints.down("xs"));
	const isXXS = useMediaQuery(theme.breakpoints.down(400));
	const [sortOrder, setSortOrder] = React.useState<TSortOrder>("name");

	const handleSetSort = (criteria: TSortOrder) => () => {
		setSortOrder(criteria);
	};

	return (
		<TableContainer className={classes.container} component={Paper}>
			<Table className={classes.table} size="small" aria-label="Deck table">
				<TableHead>
					<TableRow>
						<StyledTableCell
							className={classes.setterCell}
							onClick={handleSetSort("name")}
						>
							<Box display="flex" alignItems="center">
								Card name {sortOrder === "name" && <ArrowDropDownIcon />}
							</Box>
						</StyledTableCell>
						{isXXS ? null : (
							<StyledTableCell
								className={classes.setterCell}
								onClick={handleSetSort("manacost")}
								align="right"
							>
								<Box
									display="flex"
									alignItems="center"
									justifyContent="flex-end"
								>
									Mana Cost{sortOrder === "manacost" && <ArrowDropDownIcon />}{" "}
								</Box>
							</StyledTableCell>
						)}
						<StyledTableCell align="center">
							{isXS ? "List" : "# In Decklist"}
						</StyledTableCell>
						<StyledTableCell align="center">
							{isXS ? "Deck" : "# In Deck"}
						</StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortCardsByParam(Object.values(deck.deckList), sortOrder)!.map(
						(card: any) => {
							return <DeckDetailTableRow card={card} deck={deck} />;
						}
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default DeckDetailTable;
