import { View, Image, StyleSheet } from "react-native";
import { LoginForm } from "../components/LoginForm";
import Warning from "../components/Warning";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

// Login screen
export default function SignIn() {
  // TODO: in the future for error handling
  const [error, setError] = useState(false);

  return (
    <SafeAreaView style={styles.login}>
      {error && <Warning message="An error occured. Please try again later." />}
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <LoginForm />
    </SafeAreaView>
  );
}

// Styling
const styles = StyleSheet.create({
  login: {
    flex: 1,
    //backgroundColor: "yellow"
  },
  logo: {
    top: 126,
    alignSelf: "center",
    width: 79,
    height: 80,
    position: "absolute",
  },
});
