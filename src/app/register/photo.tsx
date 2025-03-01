import { Text, StyleSheet, View } from "react-native";
import { RegisterPhoto } from "../../components/RegisterPhoto";
import {Warning} from "../../components/Warning"

// photo screen (RegisterPhotoDetails)
const photo = () => {
  return (
    <View style={{flex: 10}}>
            <View style={{top: 20, flex: 1}}><Warning message={"The following information is voluntary and will show up once you connect with a neighbor."} /></View>
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