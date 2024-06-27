const map = new Map();
export const retryCounter = (slotId, action)=>{
    if (!map.has(slotId)) map.set(slotId, {
        count: 0
    });
    if (action === "increment") map.get(slotId).count++;
    else if (action === "clear") map.delete(slotId);
    else if (action === "get") return map.get(slotId)?.count;
};
