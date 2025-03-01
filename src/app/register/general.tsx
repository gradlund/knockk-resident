
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterGeneral } from "../../components/RegisterGeneral";
import { Link } from "expo-router";
import { styles } from "../../assets/Stylesheet";

// general screen (general details)
const general = () => {
  return (
    <SafeAreaView style={{flex: 1, flexDirection: "column"}}>
      <Text style={styles.header}>Knockk</Text>
      <RegisterGeneral />
      <Link style={[styles.link, {top: 85}]} href="/sign-in">
                Login
              </Link>
    </SafeAreaView>
  );
};

export default general;

