import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface SocialMediaProps {
  platform: string;
  username: string;
}

export const SocialMedia = ({ platform, username }: SocialMediaProps) => {
  let icon;
  return (
    <View style={styles.row}>
      {platform == "snapchat" && (
        <Ionicons name="logo-snapchat" style={styles.icon} size={20} />
      )}
      {platform == "x" && (
        <Ionicons name="logo-twitter" style={styles.icon} size={20} />
      )}
      {platform == "instagram" && (
        <Ionicons name="logo-instagram" style={styles.icon} size={20} />
      )}
      {platform == "facebook" && (
        <Ionicons name="logo-facebook" style={styles.icon} size={20} />
      )}
      <Text>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "center",
    width: "90%",
    gap: 30,
    height: 58,
    marginBottom: 10,
    paddingTop: 5,
    paddingRight: 20,
    paddingBottom: 5,
    paddingLeft: 30,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: "center",

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
