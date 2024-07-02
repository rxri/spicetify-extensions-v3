export interface SettingsClient {
	updateAdServerEndpoint(params: { slotIds: string[]; url: string }): Promise<void>;
	updateDisplayTimeInterval(params: { slotId: string; timeInterval: string }): Promise<void>;
	updateSlotEnabled(params: { slotId: string; enabled: boolean }): Promise<void>;
	updateStreamTimeInterval(params: { slotId: string; timeInterval: string }): Promise<void>;
}

export interface SlotsClient {
	clearAllAds(params: { slotId: string }): Promise<void>;
}
