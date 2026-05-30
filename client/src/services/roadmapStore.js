const INDEX_KEY = "degreemap.roadmaps.index";
const itemKey = (id) => `degreemap.roadmaps.item.${id}`;
const shareIndex = "degreemap.roadmaps.shareIndex";
const safeParse = (raw, fallback) => {
    if (!raw)
        return fallback;
    try {
        return JSON.parse(raw);
    }
    catch {
        return fallback;
    }
};
const readShareIndex = () => safeParse(localStorage.getItem(shareIndex), {});
const writeShareIndex = (idx) => {
    try {
        localStorage.setItem(shareIndex, JSON.stringify(idx));
    }
    catch {
        /* ignore */
    }
};
export const listRoadmaps = () => {
    const ids = safeParse(localStorage.getItem(INDEX_KEY), []);
    return ids
        .map((id) => safeParse(localStorage.getItem(itemKey(id)), null))
        .filter((r) => r !== null)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};
export const getRoadmap = (id) => safeParse(localStorage.getItem(itemKey(id)), null);
export const getRoadmapByShareToken = (token) => {
    const idx = readShareIndex();
    const id = idx[token];
    return id ? getRoadmap(id) : null;
};
export const saveRoadmap = (roadmap) => {
    try {
        localStorage.setItem(itemKey(roadmap.id), JSON.stringify(roadmap));
        const ids = safeParse(localStorage.getItem(INDEX_KEY), []);
        if (!ids.includes(roadmap.id)) {
            ids.push(roadmap.id);
            localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
        }
        const idx = readShareIndex();
        idx[roadmap.shareToken] = roadmap.id;
        writeShareIndex(idx);
    }
    catch {
        /* ignore */
    }
};
export const deleteRoadmap = (id) => {
    try {
        const r = getRoadmap(id);
        localStorage.removeItem(itemKey(id));
        const ids = safeParse(localStorage.getItem(INDEX_KEY), []).filter((x) => x !== id);
        localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
        if (r) {
            const idx = readShareIndex();
            delete idx[r.shareToken];
            writeShareIndex(idx);
        }
    }
    catch {
        /* ignore */
    }
};
export const generateShareToken = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
export const generateRoadmapId = () => `rm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
