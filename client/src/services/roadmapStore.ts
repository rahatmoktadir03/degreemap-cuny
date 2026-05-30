import type { Edge, Node } from "reactflow";
import type { RoadmapNodeData } from "../data/roadmapTemplates";

export interface StoredRoadmap {
  id: string;
  title: string;
  campus?: string;
  major?: string;
  shareToken: string;
  nodes: Node<RoadmapNodeData>[];
  edges: Edge[];
  updatedAt: string;
}

const INDEX_KEY = "degreemap.roadmaps.index";
const itemKey = (id: string) => `degreemap.roadmaps.item.${id}`;
const shareIndex = "degreemap.roadmaps.shareIndex";

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const readShareIndex = (): Record<string, string> =>
  safeParse(localStorage.getItem(shareIndex), {} as Record<string, string>);

const writeShareIndex = (idx: Record<string, string>) => {
  try {
    localStorage.setItem(shareIndex, JSON.stringify(idx));
  } catch {
    /* ignore */
  }
};

export const listRoadmaps = (): StoredRoadmap[] => {
  const ids = safeParse<string[]>(localStorage.getItem(INDEX_KEY), []);
  return ids
    .map((id) => safeParse<StoredRoadmap | null>(localStorage.getItem(itemKey(id)), null))
    .filter((r): r is StoredRoadmap => r !== null)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

export const getRoadmap = (id: string): StoredRoadmap | null =>
  safeParse<StoredRoadmap | null>(localStorage.getItem(itemKey(id)), null);

export const getRoadmapByShareToken = (token: string): StoredRoadmap | null => {
  const idx = readShareIndex();
  const id = idx[token];
  return id ? getRoadmap(id) : null;
};

export const saveRoadmap = (roadmap: StoredRoadmap) => {
  try {
    localStorage.setItem(itemKey(roadmap.id), JSON.stringify(roadmap));
    const ids = safeParse<string[]>(localStorage.getItem(INDEX_KEY), []);
    if (!ids.includes(roadmap.id)) {
      ids.push(roadmap.id);
      localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
    }
    const idx = readShareIndex();
    idx[roadmap.shareToken] = roadmap.id;
    writeShareIndex(idx);
  } catch {
    /* ignore */
  }
};

export const deleteRoadmap = (id: string) => {
  try {
    const r = getRoadmap(id);
    localStorage.removeItem(itemKey(id));
    const ids = safeParse<string[]>(localStorage.getItem(INDEX_KEY), []).filter((x) => x !== id);
    localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
    if (r) {
      const idx = readShareIndex();
      delete idx[r.shareToken];
      writeShareIndex(idx);
    }
  } catch {
    /* ignore */
  }
};

export const generateShareToken = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

export const generateRoadmapId = () =>
  `rm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
