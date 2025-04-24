import { create } from "zustand";
import { UUIDTypes } from "../util/types/types";

// Define actions of the store
type RegisterAction = {
  setGeneral(
    id: UUIDTypes,
    email: String,
    firstName: String,
    lastName: String,
    password: String
  ): void;
  setLiving(leaseId: UUIDTypes): void;
  setPersonal(
    gender: String,
    age?: number,
    hometown?: String,
    biography?: String
  ): void;
  setPhotos(profilePhoto?: String, backgroundPhoto?: String): void;
  setSocials(
    instagram?: String,
    snapchat?: String,
    x?: String,
    facebook?: String
  ): void;
  getResidentInfo(): RegisterState;
};

// Define state of the store
export type RegisterState = {
  id: UUIDTypes;
  email: String;
  firstName: String;
  lastName: String;
  password: String;
  leaseId: UUIDTypes;
  gender: String;
  age?: number;
  hometown?: String;
  biography?: String;
  profilePhoto?: String;
  backgroundPhoto?: String;
  instagram?: String;
  snapchat?: String;
  x?: String;
  facebook?: String;
};

// Create the store which includes actions and state
export const useRegisterStore = create<RegisterAction & RegisterState>(
  (set, get) => ({
    id: "0-0-0-0-0",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    leaseId: "0-0-0-0-0",
    gender: "",
    age: undefined,
    hometown: undefined,
    biography: undefined,
    profilePhoto: undefined,
    backgroundPhoto: undefined,
    instagram: undefined,
    snapchat: undefined,
    x: undefined,
    facebook: undefined,

    setGeneral(id, email, firstName, lastName, password) {
      set({
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      });
    },
    setLiving(leaseId) {
      set({ leaseId: leaseId });
    },
    setPersonal(gender, age, hometown, biography) {
      set({
        gender: gender,
        age: age,
        hometown: hometown,
        biography: biography,
      });
    },
    setPhotos(profilePhoto, backgroundPhoto) {
      set({ profilePhoto: profilePhoto, backgroundPhoto: backgroundPhoto });
    },
    setSocials(instagram, snapchat, x, facebook) {
      set({
        instagram: instagram,
        snapchat: snapchat,
        x: x,
        facebook: facebook,
      });
    },
    getResidentInfo: () => {
      //return get() would return the methods too
      return {
        id: get().id,
        email: get().email,
        firstName: get().firstName,
        lastName: get().lastName,
        password: get().password,
        leaseId: get().leaseId,
        gender: get().gender,
        age: get().age,
        hometown: get().hometown,
        biography: get().biography,
        profilePhoto: get().profilePhoto,
        backgroundPhoto: get().backgroundPhoto,
        instagram: get().instagram,
        snapchat: get().snapchat,
        x: get().x,
        facebook: get().facebook,
      };
    },
  })
);
