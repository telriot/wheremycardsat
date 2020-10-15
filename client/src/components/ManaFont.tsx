import React from "react";
import "../styles/fonts/mana.css";
function ManaFont({ manacost }: { manacost: any }) {
	return manacost.map((manaSymbol: any, index: any) =>
		manaSymbol === "/" ? (
			<span>{" / "}</span>
		) : (
			<i
				key={`manaCost${index}`}
				className={`ms ms-${manaSymbol} ms-cost mana-font`}
			/>
		)
	);
}

export default ManaFont;
