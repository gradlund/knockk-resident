import { SimpleLineIcons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../assets/Stylesheet";
import {
  deleteFriendship,
  getFriendship,
  updateFriendship,
} from "../util/APIService";
import Warning from "./Warning";

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

  // If a friendship exists
  const [hasFriendship, setHasFriendship] = useState<boolean>(false);
  // If the user resident has sent a request to the friend
  const [hasSentFriendship, setSentFriendship] = useState(false);
  // Variable if the user resident has a friend request from antoher resident
  const [hasFriendRequest, setFriendRequest] = useState(false);

  const [error, setError] = useState<String>();

  // Method for fetching a friendship between the user and the neighbor
  const fetchFriendship = async () => {
    try {
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
    } catch (error: any) {
      // Do not want an error to be shown if the friendship doesn't exist.
      if (
        error == "does not exist or problem retrieving." ||
        error == "Not Found. Friendship does not exist."
      ) {
        //when will this run?
        setButton({ icon: icon.plus, text: "Knockk Knockk" });
      } else {
        setError("A problem occurred.");
      }
      //console.error(error)
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
        console.log("fetching");
        fetchFriendship();
      }

      //do something when goes away
      return () => {};
    }, [])
  );

  // Method for handling for when a user clicks on the friendship button
  const handleFriendship = async () => {
    try {
      // If no friendship exists, create friendship
      if (!hasFriendship) {
        console.log("no friendship");
        handleIsFriendsState(false);
        await updateFriendship(userId, friendId, false);
        await fetchFriendship();
      }

      // If it's pending, and user clicks, delete friendship
      else if (hasSentFriendship) {
        handleIsFriendsState(false);
        console.log("deleteing pending friendship");
        await deleteFriendship(userId, friendId);
        //await fetchFriendship();
        setHasFriendship(false);
        setButton({ icon: icon.plus, text: "Knockk Knockk" });
      }

      // If it's accepting, update the friendship to accepted
      else if (hasFriendRequest) {
        handleIsFriendsState(true);
        console.log("accepting firendhsip");
        await updateFriendship(userId, friendId, true);
        await fetchFriendship();
      }

      // If connected, and user clicks, delete the friendship
      else {
        handleIsFriendsState(false);
        console.log("deleting connected freindship");
        await deleteFriendship(userId, friendId);
        setHasFriendship(false);
        setButton({ icon: icon.plus, text: "Knockk Knockk" });
      }

      // Fetch the friendship again once connection has changed
      // Deleting a friendship, would try to get a friendship that doesn't exist
      // await fetchFriendship();
    } catch (error: any) {
      setError("An error occurred.");
      //console.error(error);
    }
  };

  return (
    <View>
      {error && (
        <View style={{ position: "absolute", alignSelf: "center", top: -200 }}>
          <Warning message={error.toString()} />
        </View>
      )}
      <TouchableOpacity
        style={styles.friendshipButton}
        onPress={handleFriendship}
      >
        <SimpleLineIcons name={button.icon} size={18} />
        <Text style={[styles.buttonText, { color: "black" }]}>
          {button.text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
