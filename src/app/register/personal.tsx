import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RegisterPersonal } from "../../components/RegisterPersonal";
import {Warning} from "../../components/Warning"

// personal screen (RegisterPersonalDetails)
const personal = () => {
  return (
    <View style={{flex: 10, justifyContent: "center"}}>
      <View style={{top: 20, flex: 2}}><Warning message={"The following information is voluntary and will show up once you connect with a neighbor."} /></View>
        <RegisterPersonal />
    </View>
  );
};

export default personal;