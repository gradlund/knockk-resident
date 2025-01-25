import { useCallback, useEffect, useState } from "react";
import { addFriendship, getFriendship } from "../util/APIService";
import { TouchableOpacity, StyleSheet, Text, Button } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

interface FriendshipProps {
  userId: string;
  friendId: string;
  isConnected: boolean;
  handleIsFriendsState: (data: boolean) => void;
}

interface FriendButton {
  text: string;
  icon: icon;
}

enum icon {
  hourglass = "hourglass",
  plus = "plus",
  check = "check",
}

export const FriendshipButton = ({
  userId,
  friendId,
  isConnected,
  handleIsFriendsState,
}: FriendshipProps) => {
  const [button, setButton] = useState<FriendButton>({
    icon: icon.plus,
    text: "",
  });

  //const []

  const [connected, setConnected] = useState(isConnected);
  const [hasFriendship, setHasFriendship] = useState<boolean>(false);
  const [isPendingByFriend, setIsPendingByFriend] = useState(false);

  const fetchFriendship = async () => {
    const friendship = await getFriendship(userId, friendId);
    console.log(friendship?.accepted);

    // If null, it means the friendship doesn't exist
    if (friendship == null) {
      // Show connect button
      console.log("Not friends");
      setButton({ icon: icon.plus, text: "Knockk Knockk" });
      setHasFriendship(false);
    }
    // Else check if the user sent the request and show pending
    else if (friendship.inviteeId == userId && !friendship.accepted) {
      // Show pending
      console.log("Accept");
      setButton({ icon: icon.check, text: "Accept" });
      setHasFriendship(true);
      setIsPendingByFriend(true);
    }
    // Else show pending
    else if (friendship.invitorId == userId && !friendship.accepted) {
      console.log("Pending request by the user");
      setButton({ icon: icon.hourglass, text: "Pending" });
      setHasFriendship(true);
    }
    // Friends
    else {
      //console.log("Friends")
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("is connected " + isConnected);
      // If connected, do not need to check if it's pending
      if (isConnected) {
        setButton({ icon: icon.check, text: "" });
      }
      // Else fetch friendship to see if there is a friendship, if it's pending, or if it needs to be accepted 
      else {
        fetchFriendship();
      }

      //do something when goes away
      return () => {};
    }, [])
  );

  const handleFriendship = () => {
    // If no friendship exists, create friendship
    if(!hasFriendship){
      addFriendship(userId, friendId);

    }

    // If it's pending, and user clicks, delete friendship

    // If it's accepting, update the friendship to accepted

    // If connected, and user clicks, delete the friendship

    handleIsFriendsState(true);
  };

  return (
    <TouchableOpacity
      style={styles.friendshipButton}
      onPress={handleFriendship}
    >
      <SimpleLineIcons name={button.icon} size={18} />
      <Text style={styles.buttonText}>{button.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 16,
    fontFamily: "Albert-Sans",
  },
  friendshipButton: {
    //flex: 1,
    flexDirection: "row",
    //alignItems: "center",
    gap: 10,
    paddingTop: 14,
    paddingRight: 20,
    paddingBottom: 14,
    paddingLeft: 20,
    right: 20,
    top: 250,
    position: "absolute",

    alignSelf: "flex-end",
    borderRadius: 40,
    backgroundColor: "#E6E0FF",

    shadowColor: "black",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    //boxShadow: "0 4 4 0 rgba(0, 0, 0, 0.25) inset",
    //         backgroundColor: "#E6E0FF"
    // box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  },
});
