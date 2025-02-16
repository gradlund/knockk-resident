import { useCallback, useEffect, useState } from "react";
import {
  updateFriendship,
  getFriendship,
  deleteFriendship,
} from "../util/APIService";
import { TouchableOpacity, StyleSheet, Text, Button } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

// Interface for props
interface FriendshipProps {
  userId: string;
  friendId: string;
  isConnected: boolean;
  handleIsFriendsState: (data: boolean) => void;
}

// Interface for the button
interface FriendButton {
  text: string;
  icon: icon;
}

// Enums for the different icons used
enum icon {
  hourglass = "hourglass",
  plus = "plus",
  check = "check",
}

// Friendship button component
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

  //const [connected, setConnected] = useState(isConnected);
  // If a friendship exists
  const [hasFriendship, setHasFriendship] = useState<boolean>(false);
  // If the user resident has sent a request to the friend
  const [hasSentFriendship, setSentFriendship] = useState(false);
  // Variable if the user resident has a friend request from antoher resident
  const [hasFriendRequest, setFriendRequest] = useState(false);

  // Method for fetching a friendship between the user and the neighbor
  const fetchFriendship = async () => {
    const friendship = await getFriendship(userId, friendId);
    console.log("Called fetch");

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
      setFriendRequest(true);
    }
    // Else show pending
    else if (friendship.invitorId == userId && !friendship.accepted) {
      console.log("Pending request by the user");
      setButton({ icon: icon.hourglass, text: "Pending" });
      setHasFriendship(true);
      setSentFriendship(true);
    }
    // Friends
    else {
      console.log("Friends");
      setButton({ icon: icon.check, text: "" });
      setHasFriendship(true);
    }
  };

  // Run whenever the route is focused
  useFocusEffect(
    useCallback(() => {
      console.log("is connected " + isConnected);
      // If connected, do not need to check if it's pending; no need to retrieve friendship
      // Not connected means it could be pending or they need to accept or no friendship exists
      if (isConnected) {
        setButton({ icon: icon.check, text: "" });
        setHasFriendship(true);
        console.log("connected");
      }
      // Else fetch friendship to see if there is a friendship, if it's pending, or if it needs to be accepted
      else {
        fetchFriendship();
      }

      //do something when goes away
      return () => {};
    }, [])
  );

  // Method for handling for when a user clicks on the friendship button
  const handleFriendship = async () => {
    // If no friendship exists, create friendship
    if (!hasFriendship) {
      console.log("no friendship");
      handleIsFriendsState(false);
      await updateFriendship(userId, friendId, false);
    }

    // If it's pending, and user clicks, delete friendship
    else if (hasSentFriendship) {
      handleIsFriendsState(false);
      console.log("deleteing pending friendship");
      await deleteFriendship(userId, friendId);
    }

    // If it's accepting, update the friendship to accepted
    else if (hasFriendRequest) {
      handleIsFriendsState(true);
      console.log("accepting firendhsip");
      await updateFriendship(userId, friendId, true);
    }

    // If connected, and user clicks, delete the friendship
    else {
      handleIsFriendsState(false);
      console.log("deleting connected freindship");
      await deleteFriendship(userId, friendId);
    }

    // Fetch the friendship again once connection has changed
    await fetchFriendship();
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

// Styling
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
    top: 20,
    //position: "absolute",

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
