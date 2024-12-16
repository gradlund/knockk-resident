import { create } from "zustand";
import { UUIDTypes } from "uuid";

// Define type for UUID
type UUID = UUIDTypes;

// Define actions of the store
type ResidentAction = {
  // Set resident state
  setResident(residentId: UUID): void;
  // Get the residents id
  getResident(): UUID;
  // Clear the id
  logout(): void;
};

// Define state of the store
type ResidentState = {
  // Unique identifer of the admin
  // TODO: maybe change name of this property
  resident: UUID;
};

// Create the store which includes actions and state
export const useResidentStore = create<ResidentAction & ResidentState>(
  (set, get) => ({
    resident: "",
    setResident: (residentId: UUID) => {
      set({ resident: residentId });
    },
    getResident: () => {
      return get().resident;
    },
    //TODO: add logout functionality
    logout: () => {},
  })
);
