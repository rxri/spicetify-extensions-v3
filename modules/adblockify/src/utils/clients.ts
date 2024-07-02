import type { SettingsClient, SlotsClient } from "../interfaces/webpack.js";

export const getSettingsClient = (modules: any[]): SettingsClient | undefined => {
	try {
		return modules.find((m) => m.settingsClient).settingsClient;
	} catch (error) {
		console.error("Failed to get ads settings client", error);
		return undefined;
	}
};

export const getSlotsClient = (functionModules: any[], transport: any): SlotsClient | undefined => {
	try {
		const slots = functionModules.find(
			(m) => m.SERVICE_ID === "spotify.ads.esperanto.slots.proto.Slots" || m.SERVICE_ID === "spotify.ads.esperanto.proto.Slots"
		);
		return new slots(transport);
	} catch (error) {
		console.error("Failed to get slots client", error);
		return undefined;
	}
};
