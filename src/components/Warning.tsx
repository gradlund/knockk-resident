import { Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// Warning component that displays an icon and information about the warning
export const Warning = ({ message }: { message: string }) => {
  return (
    <View style={styles.notification}>
      <Ionicons name="information-circle-outline" size={20} color="black" />
      <Text style={styles.warning}>{message}</Text>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  notification: {
    gap: 12,
    marginLeft: -151.5,
    top: 40,
    left: "50%",
    boxShadow: "0 4 12 rgba(0, 0, 0, 0.25)",
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
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
    color: "#a495f7",
    textAlign: "left",
    alignSelf: "stretch",
  },
});

export default Warning;
