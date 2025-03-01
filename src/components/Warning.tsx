import { Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../assets/Stylesheet";

// Warning component that displays an icon and information about the warning
export const Warning = ({ message }: { message: string }) => {
  return (
    <View style={[styles.warning]}>
      <Ionicons name="information-circle-outline" size={20} color="#8976ED" />
      <Text style={styles.notification}>{message}</Text>
    </View>
  );
};

export default Warning;
