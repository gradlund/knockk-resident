import { View, Image, StyleSheet, Text } from "react-native";
import { useResidentStore } from "../state/ResidentStore";
import { useCallback, useEffect, useState } from "react";
import { getNeighborUnits, getResident } from "../util/APIService";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Link, useFocusEffect, useNavigation } from "expo-router";
import Warning from "./Warning";
import { useNeighborStore } from "../state/NeighborStore";
import { Resident, NeighborUnit as Unit } from "../util/types/types";
import { styles } from "../assets/Stylesheet";


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

    console.log(neighborUnits)

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
      setError(error.toString() + " Couldn't retrieve neighboring rooms.")
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

      console.log(above?.floor)

      // Does something when the screen is unfocused
      return () => {};
    }, [])
  );

  //Image will be changed from require assets, to uri
  //TODO: should use image background???
  return (
    <View style={{flex: 1}}>
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


