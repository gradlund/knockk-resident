import { Text, StyleSheet, View } from "react-native";
import { RegisterPhoto } from "../../components/RegisterPhoto";
import { RegisterSocial } from "../../components/RegisterSocial";

// social screen (RegisterSocialDetails)
const social = () => {
  return (
    <View style={{height: "100%"}}>
        <RegisterSocial />
    </View>
  );
};

export default social;

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