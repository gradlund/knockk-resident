import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { styles } from "../assets/Stylesheet";

interface SocialMediaProps {
  platform: string;
  username: string;
}

// Component for listing social media
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
