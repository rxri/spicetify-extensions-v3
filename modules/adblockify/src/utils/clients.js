export const getSettingsClient = (modules)=>{
    try {
        return modules.find((m)=>m.settingsClient).settingsClient;
    } catch (error) {
        console.error("Failed to get ads settings client", error);
        return null;
    }
};
export const getSlotsClient = (functionModules, transport)=>{
    try {
        const slots = functionModules.find((m)=>m.SERVICE_ID === "spotify.ads.esperanto.slots.proto.Slots" || m.SERVICE_ID === "spotify.ads.esperanto.proto.Slots");
        return new slots(transport);
    } catch (error) {
        console.error("Failed to get slots client", error);
        return null;
    }
};
