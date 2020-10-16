import React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

import TableCell from "@material-ui/core/TableCell";

const StyledTableCell = withStyles((theme: Theme) =>
	createStyles({
		root: {
			[theme.breakpoints.down("xs")]: {
				padding: theme.spacing(1, 0, 1, 1),
				fontSize: "13px",
			},
		},
	})
)(TableCell);

export default StyledTableCell;
