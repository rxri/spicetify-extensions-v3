import { adManagers, productState, slotsClient, settingsClient, slots, logger } from "../mod.js";
import { retryCounter } from "./utils/counter.js";
import { Cosmos } from "/modules/stdlib/src/expose/Platform.js";

export const bindSlots = (slots: { slot_id: string }[]) => {
	for (const slot of slots) {
		subToSlot(slot.slot_id);
		handleAdSlot({ adSlotEvent: { slotId: slot.slot_id } });
	}
};

export const subToSlot = (slotId: string) => {
	try {
		adManagers.audio.inStreamApi.adsCoreConnector.subscribeToSlot(slotId, handleAdSlot);
	} catch (error: unknown) {
		logger.error("Failed inside `subToSlot` function\n", error);
	}
};

const handleAdSlot = (data: { adSlotEvent: { slotId: string } }) => {
	const slotId = data?.adSlotEvent?.slotId;

	try {
		const adsCoreConnector = adManagers.audio?.inStreamApi?.adsCoreConnector;
		if (typeof adsCoreConnector?.clearSlot === "function") adsCoreConnector.clearSlot(slotId);
		if (slotsClient) slotsClient.clearAllAds({ slotId });
		updateSlotSettings(slotId);
	} catch (error: unknown) {
		logger.error("Failed inside `handleAdSlot` function. Retrying in 1 second...\n", error);
		retryCounter(slotId, "increment");
		if (retryCounter(slotId, "get") > 5) {
			logger.error(`Failed inside \`handleAdSlot\` function for 5th time. Giving up...\nSlot id: ${slotId}.`);
			retryCounter(slotId, "clear");
			return;
		}
		setTimeout(handleAdSlot, 1 * 1000, data);
	}
	configureAdManagers();
};

export const configureAdManagers = async () => {
	try {
		// @ts-expect-error: Cosmos has broken types
		await Cosmos.post("sp://ads/v1/testing/playtime", { value: -100000000000 });
		const { audio, billboard, leaderboard, sponsoredPlaylist } = adManagers;

		await audio.disable();
		audio.isNewAdsNpvEnabled = false;
		await billboard.disable();
		await leaderboard.disableLeaderboard();
		await sponsoredPlaylist.disable();
		adManagers?.inStreamApi && (await adManagers.inStreamApi.disable());
		if (adManagers?.vto) {
			await adManagers.vto.manager.disable();
			adManagers.vto.isNewAdsNpvEnabled = false;
		}
		setTimeout(overridePremiumValues, 100);
	} catch (error: unknown) {
		logger.error("Failed inside `configureAdManagers` function\n", error);
	}
};

const overridePremiumValues = async () => {
	try {
		await productState.putOverridesValues({ pairs: { ads: "0", catalogue: "premium", product: "premium", type: "premium" } });
	} catch (error: unknown) {
		logger.error("Failed inside `disableAds` function\n", error);
	}
};

const updateSlotSettings = async (slotId: string) => {
	try {
		if (!settingsClient) return;
		await settingsClient.updateAdServerEndpoint({ slotIds: [slotId], url: "http://localhost/no/thanks" });
		await settingsClient.updateStreamTimeInterval({ slotId, timeInterval: "0" });
		await settingsClient.updateSlotEnabled({ slotId, enabled: false });
		await settingsClient.updateDisplayTimeInterval({ slotId, timeInterval: "0" });
	} catch (error: unknown) {
		logger.error("Failed inside `updateSlotSettings` function\n", error);
	}
};

export const intervalUpdateSlotSettings = async () => {
	for (const slot of slots) {
		updateSlotSettings(slot.slot_id);
	}
};
