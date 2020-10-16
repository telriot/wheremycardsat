import React from "react";
import { ICard } from "../declarations/index";
export const trimName = (name: string) => {
	const [partial, _] = name.split("//");
	const trimmedName = partial.replace(`"`, "").trim();
	return trimmedName;
};
export const translateToManaFonts = (cost: string) => {
	console.log(cost);
	return cost
		.replace(/}\//g, "{|}")
		.replace(/\//g, "")
		.replace(/{|}/g, " ")
		.toLowerCase()
		.split(" ")
		.filter((manacost) => manacost !== "");
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
				? [
						...translateToManaFonts(card.card_faces[0].mana_cost),
						"/",
						...translateToManaFonts(card.card_faces[1].mana_cost),
				  ]
				: translateToManaFonts(card.card_faces[0].mana_cost)
			: translateToManaFonts(card.mana_cost),
		image_uris:
			hasFaces && !hasImageUris
				? card.card_faces.map((face: any) => ({
						small: face.image_uris.small,
						normal: face.image_uris.normal,
						art_crop: face.image_uris.art_crop,
				  }))
				: {
						small: card.image_uris.small,
						normal: card.image_uris.normal,
						art_crop: card.image_uris.art_crop,
				  },
		type_line: card.type_line,
	};
	console.log(cardObj.mana_cost);
	return cardObj;
};

export const calculateManaWeight = (manacost: string[]) => {
	if (!manacost || !manacost.length) return 0;
	let weight = 0;
	let numbersRegex = new RegExp(/\d/);
	for (let symbol of manacost) {
		if (numbersRegex.test(symbol)) {
			weight += ~~symbol;
		} else {
			switch (symbol) {
				case "w":
					weight += 1.01;
					break;
				case "u":
					weight += 1.011;
					break;
				case "b":
					weight += 1.012;
					break;
				case "r":
					weight += 1.013;
					break;
				case "g":
					weight += 1.014;
					break;
				case "x":
					weight += 1.015;
					break;
				default:
					weight += 0;
			}
		}
	}
	return weight;
};

export const sortCardsByParam = (cards: Array<ICard>, param: string) => {
	if (param === "name") {
		return cards.sort((a, b) => {
			const nameA = a.name.toUpperCase();
			const nameB = b.name.toUpperCase();
			return nameA < nameB ? -1 : nameB < nameA ? 1 : 0;
		});
	} else if (param === "manacost") {
		return cards.sort((a, b) => {
			console.log();
			const manacostA = calculateManaWeight(a.mana_cost) || 0;
			const manacostB = calculateManaWeight(b.mana_cost) || 0;
			return manacostA < manacostB ? -1 : manacostB < manacostA ? 1 : 0;
		});
	}
};
