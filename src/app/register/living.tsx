import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterLiving } from "../../components/RegisterLiving";

// living screen (RegisterLivingDetails)
const living = () => {
  return (
    <View style={{flex: 1}}>
        <RegisterLiving />

    </View>
  );
};

export default living;

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