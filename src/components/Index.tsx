import { View, Image, StyleSheet } from "react-native";
import { useResidentStore } from "../state/ResidentStore";
import { useCallback, useEffect, useState } from "react";
import { getNeighborUnits, getResident } from "../util/APIService";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, useFocusEffect, useNavigation } from "expo-router";
import Warning from "./Warning";
import { useNeighborStore } from "../state/NeighborStore";
import { Resident, NeighborUnit as Unit } from "../util/types/types";


// Index component
export const Index = () => {
 const navigation = useNavigation();

  // Resident's id
  const { id, resident } = useResidentStore();

  // State for all the neighboring rooms
  const [above, setAbove] = useState<Unit>();
  const [right, setRight] = useState<Unit>();
  const [below, setBelow] = useState<Unit>();
  const [left, setLeft] = useState<Unit>();

  const [hasAPICall, setHasAPICall] = useState(false);

  const [error, setError] = useState<String>();

  const {setNeighborUnits, units} = useNeighborStore()

  const fetchNeighbors = async () => {
    try{
    const neighborUnits = await getNeighborUnits(id);
    setHasAPICall(true)

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
          setRight({ direction: "right", floor: unit.floor, room: unit.room });
        }
        if (unit.direction == "below") {
          setBelow({ direction: "below", floor: unit.floor, room: unit.room });
        }
        if (unit.direction == "left") {
          setLeft({ direction: "left", floor: unit.floor, room: unit.room });
        }
      });
    }
    }catch(error){
      if(error == "does not exist"){
        setError("No units registered.")
      }
      setError(error.toString())
    }
  };

  useFocusEffect(
    useCallback(() => {
      setError(undefined);

      //User will always have a first name, so if it's undefined, thorw an errror
      if(!resident.firstName) setError("Problem user data");
  
      if(!hasAPICall){
      // Fetch if it's the first time opening the app
      // Invocked whenever the route is focused
      fetchNeighbors();
      }

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
        {resident.profilePhoto && <Image style={styles.image} source={{uri: `data:image/jpeg;base64,${resident.profilePhoto.replaceAll('"',"")}`}} />}
        {!resident.profilePhoto && <View style={styles.image}></View>}
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
    resizeMode: "stretch",
    borderColor: "white",
    borderWidth: 2,
    height: 100, // Should use a circle instaed because this is throwing the other styles off
    width: 100,
    backgroundColor: "#CBC1F6",
  },
});
