export const trimName = (name: string) => {
	const [partial, _] = name.split("//");
	const trimmedName = partial.replace(`"`, "").trim();
	return trimmedName;
};
export const normalizeCard = (card: any) => {
	const hasFaces = Boolean(card.card_faces !== undefined);
	const hasImageUris = Boolean(card.image_uris !== undefined);
	const hasBothManaCosts = Boolean(
		hasFaces &&
			card.card_faces[0].mana_cost.length &&
			card.card_faces[1].mana_cost.length
	);
	let cardObj = {
		name: card.name,
		mana_cost: hasFaces
			? hasBothManaCosts
				? card.card_faces[0].mana_cost + "/" + card.card_faces[1].mana_cost
				: card.card_faces[0].mana_cost
			: card.mana_cost,
		image_uris:
			hasFaces && !hasImageUris
				? card.card_faces.map((face: any) => ({
						small: face.image_uris.small,
						normal: face.image_uris.normal,
				  }))
				: {
						small: card.image_uris.small,
						normal: card.image_uris.normal,
				  },
		type_line: card.type_line,
	};
	return cardObj;
};
