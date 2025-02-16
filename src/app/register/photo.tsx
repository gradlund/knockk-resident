import { Text, StyleSheet, View } from "react-native";
import { RegisterPhoto } from "../../components/RegisterPhoto";

// photo screen (RegisterPhotoDetails)
const photo = () => {
  return (
    <View style={{height: "100%"}}>
        <RegisterPhoto />
    </View>
  );
};

export default photo;

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