import { localStorage } from "../index.js";

export const configureExpFeatures = () => {
	const expFeatures = localStorage.getItem("remote-config-overrides");
	if (!expFeatures) return;

	const overrides = { ...expFeatures, enableEsperantoMigration: true, enableInAppMessaging: false, hideUpgradeCTA: true };
	localStorage.setItem("remote-config-overrides", overrides);
};
