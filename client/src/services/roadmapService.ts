import { apiFetch, apiEnabled } from "./apiClient";
import type { StoredRoadmap } from "./roadmapStore";
import * as localStore from "./roadmapStore";

// Server-backed roadmap service with localStorage fallback.
export const getRoadmap = async (id: string): Promise<StoredRoadmap | null> => {
  if (apiEnabled) {
    const res = await apiFetch(`/api/roadmaps/detail/${encodeURIComponent(id)}`);
    return res?.data ?? null;
  }
  return localStore.getRoadmap(id);
};

export const saveRoadmap = async (roadmap: StoredRoadmap): Promise<StoredRoadmap> => {
  if (apiEnabled) {
    // If roadmap exists on server (id looks like a uuid or was created), try update first
    try {
      // If it's a template-style id (tpl-...), create as new roadmap on server
      if (roadmap.id.startsWith("tpl-")) {
        const created = await apiFetch(`/api/roadmaps`, {
          method: "POST",
          body: JSON.stringify({
            title: roadmap.title,
            nodes: roadmap.nodes,
            edges: roadmap.edges,
          }),
        });
        return created.data;
      }
      // Try PUT update
      const updated = await apiFetch(`/api/roadmaps/${encodeURIComponent(roadmap.id)}`, {
        method: "PUT",
        body: JSON.stringify({ title: roadmap.title, nodes: roadmap.nodes, edges: roadmap.edges }),
      });
      return updated.data;
    } catch (err) {
      // Fallback to create
      const created = await apiFetch(`/api/roadmaps`, {
        method: "POST",
        body: JSON.stringify({ title: roadmap.title, nodes: roadmap.nodes, edges: roadmap.edges }),
      });
      return created.data;
    }
  }
  localStore.saveRoadmap(roadmap);
  return roadmap;
};

export const listRoadmaps = async (): Promise<StoredRoadmap[]> => {
  if (apiEnabled) {
    const res = await apiFetch(`/api/roadmaps/mine`);
    return res?.data ?? [];
  }
  return localStore.listRoadmaps();
};

export const deleteRoadmap = async (id: string) => {
  if (apiEnabled) {
    await apiFetch(`/api/roadmaps/${encodeURIComponent(id)}`, { method: "DELETE" });
    return;
  }
  localStore.deleteRoadmap(id);
};

export const getRoadmapByShareToken = async (token: string): Promise<StoredRoadmap | null> => {
  if (apiEnabled) {
    const res = await apiFetch(`/api/roadmaps/public/${encodeURIComponent(token)}`);
    return res?.data ?? null;
  }
  return localStore.getRoadmapByShareToken(token);
};

export const generateRoadmapId = () => localStore.generateRoadmapId();
export const generateShareToken = () => localStore.generateShareToken();

export default {
  getRoadmap,
  saveRoadmap,
  listRoadmaps,
  getRoadmapByShareToken,
  deleteRoadmap,
  generateRoadmapId,
  generateShareToken,
};
