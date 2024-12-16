import { Slot } from "expo-router";
import SessionProvider from "./sign-in";
import { Stack } from "expo-router";
import SignIn from "./sign-in";
import { AuthProvider } from "../providers/auth-provider";

export default function Root() {
  // Wrap in the auth provider
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
