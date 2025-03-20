import { create } from "zustand";
import { UUIDTypes } from "uuid";
import { NeighborUnit } from "../util/types/types";
import { getNeighborUnits } from "../util/APIService";

// Define type for UUID
type UUID = UUIDTypes;

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
