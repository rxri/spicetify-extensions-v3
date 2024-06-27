export interface SettingsClient {
	updateAdServerEndpoint(params: { slotIds: string[]; url: string }): Promise<void>;
	updateDisplayTimeInterval(params: { slotId: string; timeInterval: string }): Promise<void>;
	updateSlotEnabled(params: { slotId: string; enabled: boolean }): Promise<void>;
	updateStreamTimeInterval(params: { slotId: string; timeInterval: string }): Promise<void>;
}

export interface SlotsClient {
	clearAllAds(params: { slotId: string }): Promise<void>;
}

export const getSettingsClient = (modules: any[]): SettingsClient | null => {
	try {
		return modules.find((m: any) => m.settingsClient).settingsClient;
	} catch (error) {
		console.error("Failed to get ads settings client", error);
		return null;
	}
};

export const getSlotsClient = (functionModules: any[], transport: any): SlotsClient | null => {
	try {
		const slots = functionModules.find(
			(m) => m.SERVICE_ID === "spotify.ads.esperanto.slots.proto.Slots" || m.SERVICE_ID === "spotify.ads.esperanto.proto.Slots"
		);
		return new slots(transport);
	} catch (error) {
		console.error("Failed to get slots client", error);
		return null;
	}
};
