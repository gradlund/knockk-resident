import { View, Image, StyleSheet } from "react-native";
import { useResidentStore } from "../state/ResidentStore";
import { useCallback, useEffect, useState } from "react";
import { getNeighborUnits } from "../util/APIService";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, useFocusEffect, useNavigation } from "expo-router";
import Warning from "./Warning";

// Interface for unit model
interface Unit {
  direction: String;
  floor: number;
  room: number;
}

// Index component
export const Index = () => {
  const navigation = useNavigation();

  // Resident's id
  const { id } = useResidentStore();

  // State for all the neighboring rooms
  const [above, setAbove] = useState<Unit>();
  const [right, setRight] = useState<Unit>();
  const [below, setBelow] = useState<Unit>();
  const [left, setLeft] = useState<Unit>();

  const [error, setError] = useState(false);

  const fetchNeighbors = async () => {
    //TODO: remove - hardcoded to bypass login
    const neighborUnits = await getNeighborUnits(id);
    // const neighborUnits = await getNeighborUnits(
    //   "db0601ac-09bd-49a4-9940-70db17b18dd9"
    //   //"53b30260-1b0e-4ecd-88ab-eac6a16510a8"
    // );

    // Null pointer exception
    //TODO: what happens if null? Force unwrap
    if (neighborUnits == undefined) {
      // NO units registered
      console.log("No units registered.");
      setError(true);
    } else if (neighborUnits == null) {
      setError(true);
      console.log("Problem fetching.");
    } else {
      neighborUnits!.forEach((unit) => {
        if (unit.direction == "top") {
          setAbove({ direction: "top", floor: unit.floor, room: unit.room });
        }
        if (unit.direction == "right") {
          setRight({ direction: "right", floor: unit.floor, room: unit.room });
        }
        if (unit.direction == "below") {
          setBelow({ direction: "below", floor: unit.floor, room: unit.room });
        }
        if (unit.direction == "left") {
          setLeft({ direction: "left", floor: unit.floor, room: unit.room });
        }

        // TODO: else show an error that no units have been registered. Contact admin for more.
      });
    }
    //if(neighborRooms!.length > 0)
  };

  useFocusEffect(
    useCallback(() => {
      setError(false);
      // Invocked whenever the route is focused
      fetchNeighbors();

      // Does something when the screen is unfocused
      return () => {};
    }, [])
  );

  //Image will be changed from require assets, to uri
  //TODO: should use image background???
  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.bigBackgroundCircle} />
        <View style={styles.smallBackgroundCircle} />
      </View>
      {error && (
        <View style={{ position: "absolute", alignSelf: "center" }}>
          <Warning message="Problem retrieving units" />
        </View>
      )}
      <Link
        style={styles.profileLink}
        href={{
          pathname: "profile",
        }}
      >
        <Image style={styles.image} source={require("../assets/logo.png")} />
      </Link>
      {right?.room && (
        <Link
          style={[styles.right, styles.arrow]}
          href={{
            pathname: "unit",
            params: { floor: right.floor, room: right.room },
          }}
        >
          <SimpleLineIcons name="arrow-right" size={40} color="black" />
        </Link>
      )}
      {below?.floor && (
        <Link
          style={[styles.down, styles.arrow]}
          href={{
            pathname: "unit",
            params: { floor: below.floor, room: below.room },
          }}
        >
          <SimpleLineIcons name="arrow-down" size={40} />
        </Link>
      )}
      {left?.room && (
        <Link
          style={[styles.left, styles.arrow]}
          href={{
            pathname: "unit",
            params: { floor: left.floor, room: left.room },
          }}
        >
          <SimpleLineIcons name="arrow-left" size={40} />
        </Link>
      )}
      {above?.floor && (
        <Link
          style={[styles.up, styles.arrow]}
          href={{
            pathname: "unit",
            params: { floor: above.floor, room: above.room },
          }}
        >
          <SimpleLineIcons name="arrow-up" size={40} />
        </Link>
      )}
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  bigBackgroundCircle: {
    backgroundColor: "rgb(203, 193, 246)",
    height: 740,
    width: 740,
    borderRadius: "100%",
    position: "absolute",
    left: "-30%",
    top: "2.5%",
  },
  smallBackgroundCircle: {
    backgroundColor: "rgb(230, 224, 255)",
    height: 620,
    width: 620,
    borderRadius: "100%",
    left: "-20%",
    top: "12.5%",
    position: "relative",
  },
  container: {},
  background: {
    justifyContent: "center",
    position: "absolute",
  },
  right: {
    right: 30,
    top: 370,
  },
  down: {
    top: 500,
    alignSelf: "center",
    position: "absolute",
  },
  left: {
    left: 30,
    top: 370,
    position: "absolute",
  },
  //OR should I do alighn middle with padding?
  up: {
    top: 160,
    alignSelf: "center",
    //verticalAlign: "middle",
    //position: "relative"
  },
  arrow: {
    color: "rgba(164, 149, 247, 1)",
    shadowColor: "black",
    shadowOffset: { width: -1, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  profileLink: {
    height: 80,
    width: 80,
    alignSelf: "center",
    top: 350,
  },
  image: {
    borderRadius: 50,
    resizeMode: "contain",
  },
});
