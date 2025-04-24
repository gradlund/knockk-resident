import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, View } from "react-native";
import { styles } from "../../assets/Stylesheet";
import Warning from "../../components/Warning";
import { useNeighborStore } from "../../state/NeighborStore";
import { useResidentStore } from "../../state/ResidentStore";
import { getNeighborUnits } from "../../util/APIService";
import { NeighborUnit as Unit } from "../../util/types/types";
import { SafeAreaView } from "react-native-safe-area-context";

// Home screen
// Matches '/' route
const Home = () => {
  // Resident's id
  const { id, resident } = useResidentStore();

  // State for all the neighboring rooms
  const [above, setAbove] = useState<Unit>();
  const [right, setRight] = useState<Unit>();
  const [below, setBelow] = useState<Unit>();
  const [left, setLeft] = useState<Unit>();

  const [hasAPICall, setHasAPICall] = useState(false);

  const [error, setError] = useState<String>();

  const { setNeighborUnits, units } = useNeighborStore();

  // Fetches neighboring units
  const fetchNeighbors = async () => {
    try {
      // Fetch units
      const neighborUnits = await getNeighborUnits(id);
      setHasAPICall(true);

      // Null pointer exception
      //TODO: what happens if null? Force unwrap
      if (neighborUnits == undefined) {
        // No units registered
        console.log("No units registered.");
        setError("No units registered.");
      } else if (neighborUnits == null) {
        setError("Problem fetching.");
        console.log("Problem fetching.");
      } else {
        setNeighborUnits(neighborUnits);
        neighborUnits!.forEach((unit) => {
          if (unit.direction == "top") {
            setAbove({ direction: "top", floor: unit.floor, room: unit.room });
          }
          if (unit.direction == "right") {
            setRight({
              direction: "right",
              floor: unit.floor,
              room: unit.room,
            });
          }
          if (unit.direction == "below") {
            setBelow({
              direction: "below",
              floor: unit.floor,
              room: unit.room,
            });
          }
          if (unit.direction == "left") {
            setLeft({ direction: "left", floor: unit.floor, room: unit.room });
          }
        });
      }
    } catch (error: any) {
      if (error == "does not exist") {
        setError("No units registered.");
      }
      setError(error.toString() + " Couldn't retrieve neighboring rooms.");

      router.navigate({
        pathname: "/error",
        params: { reason: "problem fetching" },
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      setError(undefined);

      // User will always have a first name, so if it's undefined, thorw an errror
      if (!resident?.firstName) setError("Problem user data");
      // if there is not an API call
      if (!hasAPICall) {
        // Fetch if it's the first time opening the app
        // Invocked whenever the route is focused
        fetchNeighbors();
      }

      // Does something when the screen is unfocused
      return () => {};
    }, [])
  );

  //Image will be changed from require assets, to uri
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.background}>
        <View style={styles.bigBackgroundCircle} />
        <View style={styles.smallBackgroundCircle} />
      </View>
      {error && (
        <View style={{ position: "absolute", alignSelf: "center", top: 40 }}>
          <Warning message={error.toString()} />
        </View>
      )}
      <Link
        style={styles.profileLink}
        href={{
          pathname: "profile",
        }}
      >
        {resident?.profilePhoto != null && (
          <Image
            style={[styles.image]}
            source={{
              uri: `data:image/jpeg;base64,${resident.profilePhoto.replaceAll(
                '"',
                ""
              )}`,
            }}
          />
        )}
        {!resident?.profilePhoto && <View style={styles.image}></View>}
      </Link>
      {right?.room && (
        <Link
          style={[styles.right, styles.arrow]}
          href={{
            pathname: "unit",
            params: { floor: right.floor, room: right.room },
          }}
        >
          <SimpleLineIcons name="arrow-right" size={40} />
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
    </SafeAreaView>
  );
};

export default Home;
