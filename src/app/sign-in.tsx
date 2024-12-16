import { View, Image, StyleSheet } from "react-native";
import { LoginForm } from "../components/LoginForm";
import Warning from "../components/Warning";
import { useState } from "react";

// Login screen
export default function SignIn() {
  // TODO: in the future for error handling
  const [error, setError] = useState(false);

  return (
    <View style={styles.login}>
      {error && <Warning message="An error occured. Please try again later." />}
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <LoginForm />
    </View>
  );
}

// Styling
const styles = StyleSheet.create({
  login: {
    flex: 1,
  },
  logo: {
    top: 126,
    alignSelf: "center",
    width: 79,
    height: 80,
    position: "absolute",
  },
});
