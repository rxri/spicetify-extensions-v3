import { Platform, Cosmos } from "/modules/official/stdlib/src/expose/Platform.js";
import { modules, exportedFunctions } from "/modules/official/stdlib/src/webpack/index.js";
import { getSettingsClient, getSlotsClient } from "./src/utils/clients.js";
import { bindSlots, configureAdManagers, intervalUpdateSlotSettings } from "./src/slot.js";
import { createLogger } from "/modules/official/stdlib/index.js";
import { configureExpFeatures } from "./src/expFeatures.js";
const { getAdManagers, getUserAPI, getLocalStorageAPI } = Platform;
export const localStorage = getLocalStorageAPI();
export const adManagers = getAdManagers();
export const productState = // @ts-expect-error: Depends on the version of Spotify, AutoGen doesn't have all of them
getUserAPI()?._product_state || getUserAPI()._product_state_service || Platform?.getProductStateAPI()?.productStateApi;
// @ts-expect-error: Apparently Cosmos expects two arguments, but the second argument is body which is optional
export const slots = await Cosmos.get("sp://ads/v1/slots");
export const settingsClient = getSettingsClient(modules);
export const slotsClient = getSlotsClient(exportedFunctions, productState.transport);
export let logger;
// @ts-expect-error: I don't know.
export default function(mod) {
    logger = createLogger(mod);
    /**
	 * Main functions
	 */ configureExpFeatures();
    bindSlots(slots);
    productState.subValues({
        keys: [
            "ads",
            "catalogue",
            "product",
            "type"
        ]
    }, ()=>configureAdManagers());
    logger.info("Loaded successfully");
    // Update slot settings after 5 seconds... idk why, don't ask me why, it just works
    setTimeout(intervalUpdateSlotSettings, 5 * 1000);
}
