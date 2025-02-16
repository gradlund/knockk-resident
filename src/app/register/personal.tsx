import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterPersonal } from "../../components/RegisterPersonal";

// personal screen (RegisterPersonalDetails)
const personal = () => {
  return (
    <View style={{}}>
        <RegisterPersonal />

    </View>
  );
};

export default personal;

const styles = StyleSheet.create({
  header: {
    fontSize: 32,
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