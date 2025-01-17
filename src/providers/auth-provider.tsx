import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";
import { useResidentStore } from "../state/ResidentStore";

// Create the auth context.
const AuthContext = createContext<{
  // Used to sign in a user by id
  signIn: (uuid: string) => void;
  // Used to signout the user
  signOut: () => void;
  // Used to see if component is still mounting
  mounting: boolean;
}>({
  signIn: (uuid: string) => null,
  signOut: () => null,
  //session: null,
  mounting: true,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

// Auth provider that wraps the app and provides authentication context.
export function AuthProvider({ children }: PropsWithChildren) {
  // Functions from the useResidentStore
  const { setResident, logout, id } = useResidentStore();
  //const [session, setSession] = useState(null);
  // State to track if component is still mounting
  const [mounting, setMount] = useState(true);

  return (
    <AuthContext.Provider
      value={{
        signIn: (uuid: string) => {
          // Perform sign-in logic here
          setResident(uuid);
          setMount(false);
        },
        signOut: () => {
          logout();
        },
        //session,
        mounting,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
