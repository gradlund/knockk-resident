import { Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Warning component that displays an icon and information about the warning
export const Warning = ({ message }: { message: string }) => {
  return (
    <View style={styles.notification}>
      <Ionicons name="information-circle-outline" size={20} color="#8976ED" />
      <Text style={styles.warning}>{message}</Text>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  notification: {
    gap: 12,
    alignSelf: "center",
    boxShadow: "0 2 6 rgba(0, 0, 0, 0.25)",
    width: 302,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    borderColor: "#000",
    borderWidth: 1,
  },
  warning: {
    fontSize: 12,
    fontFamily: "AlbertSans-Regular",
    color: "#8976ED",
    textAlign: "left",
  },
});

export default Warning;
