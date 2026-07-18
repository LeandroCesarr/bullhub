import { atom } from "jotai";

export type QueueTab = "overview" | "workers" | "jobs";

export const queueTabAtom = atom<QueueTab>("overview");
