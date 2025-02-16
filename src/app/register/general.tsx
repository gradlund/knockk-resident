
import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterGeneral } from "../../components/RegisterGeneral";
import { Link } from "expo-router";

// general screen (general details)
const general = () => {
  return (
    <SafeAreaView style={{flex: 1, flexDirection: "column"}}>
      <Text style={styles.header}>Knockk</Text>
      <View  style={styles.component}>
      <RegisterGeneral />
      </View>
      <Link style={styles.link} href="/sign-in">
                Login
              </Link>
    </SafeAreaView>
  );
};

export default general;

const styles = StyleSheet.create({
  component: {

//backgroundColor: "yellow",
  },
  header: {
    fontSize: 32,
    alignSelf: "center",
    paddingTop: 60
  },
  link: {
    fontSize: 16,
    lineHeight: 22,
    textDecorationLine: "underline",
    fontFamily: "Inter-Regular",
    color: "#1e1e1e",
    alignSelf: "center",
  },
})