import { Ionicons } from "@expo/vector-icons";
import { Image, View } from "react-native";
import { styles } from "../assets/Stylesheet";

// Interface for props
interface ProfileProps {
  isFriends: boolean;
  isUser: boolean;
  uri: string | undefined;
}

// Profile photo component
export const ProfilePhoto = ({ isFriends, isUser, uri }: ProfileProps) => {
  return (
    <View style={{ height: 0 }}>
      {uri == undefined && !isUser && isFriends && (
        <Image
          style={styles.residentNotConnected}
          source={require("../assets/no-profile.png")}
        />
      )}
      {/* if the photo is undefined, that means that they are not connected? could also check if connected is false */}
      {uri?.includes("not-connected") && (
        <View
          style={[
            styles.residentPhoto,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Ionicons name="help-circle-outline" size={40} color={"white"} />
        </View>
      )}

      {!isUser && uri && (
        <View>
          <Image
            style={styles.residentPhoto}
            source={{
              uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}`,
            }}
          />
        </View>
      )}
      {isUser && uri && (
        <Image
          style={styles.profile}
          source={{ uri: `data:image/jpeg;base64,${uri?.replaceAll('"', "")}` }}
        />
      )}
      {uri == undefined && isUser && (
        <View
          style={[
            styles.profile,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          {/* <Ionicons name="help-circle-outline" size={40} color={"white"} />*/}
        </View>
      )}
      {/* if they are not connected, it will say not connected. if connected and no photo,  it will be blank */}
      {!isUser && !uri?.includes("not-connected") && !isFriends && (
        <View
          style={[
            styles.residentPhoto,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Ionicons name="help-circle-outline" size={80} color={"white"} />
        </View>
      )}
      {/* {!isFriends && (
        <Image style={styles.residentNoTConnected} source={require("../assets/no-profile.png")} />
      )} */}
    </View>
  );
};
