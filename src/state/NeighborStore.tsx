import { create } from "zustand";
import { NeighborUnit } from "../util/types/types";

// Define actions of the store
type NeighborAction = {
  setNeighborUnits(units: [NeighborUnit]): void;
  getNeighborUnits(): [NeighborUnit];
};

type NeighborType = {
  units: [NeighborUnit];
};

// Create the store which includes actions and state
export const useNeighborStore = create<NeighborAction & NeighborType>(
  (set, get) => ({
    units: [{ direction: "", floor: 0, room: 0 }],

    setNeighborUnits(units: [NeighborUnit]) {
      set({ units: units });
    },
    getNeighborUnits: () => {
      return get().units;
    },
  })
);
