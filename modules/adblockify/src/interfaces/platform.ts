export interface AdManagers {
	audio: {
		disable(): Promise<void>;
		inStreamApi: {
			adsCoreConnector: {
				clearSlot(slotId: string): void;
				subscribeToSlot(slotId: string, callback: (data: { adSlotEvent: { slotId: string } }) => void): void;
			};
		};
		isNewAdsNpvEnabled: boolean;
	};
	billboard: {
		disable(): Promise<void>;
	};
	leaderboard: {
		disableLeaderboard(): Promise<void>;
	};
	inStreamApi: {
		disable(): Promise<void>;
	};
	sponsoredPlaylist: {
		disable(): Promise<void>;
	};
	vto?: {
		manager: {
			disable(): Promise<void>;
		};
		isNewAdsNpvEnabled: boolean;
	};
}

export interface ProductStateAPI {
	putOverridesValues(params: { pairs: { [key: string]: string } }): Promise<void>;
	subValues(params: { keys: string[] }, callback: () => void): Promise<void>;
	transport: any;
}
