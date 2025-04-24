import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ResidentRow from "../../../components/ResidentRow";
import Warning from "../../../components/Warning";
import { useResidentStore } from "../../../state/ResidentStore";
import { getNeighborResidents } from "../../../util/APIService";

// Interface for the resident
interface ResidentModel {
  name: string;
  photo?: string;
  isConnected: boolean;
  // neighborId: UUIDTypes;
  neighborId: string;
}

// Unit screen
const Unit = () => {
  const [neighbors, setNeighbors] = useState<ResidentModel[]>();
  const [error, setError] = useState<string>();

  // Retrieve parameters
  const params = useLocalSearchParams();

  //TODO: error handling
  const floor = Number(params.floor);
  const room = Number(params.room);

  // Resident's id
  const { id } = useResidentStore();

  // This functions fetches the residents of the unit
  const fetchResidents = async () => {
    try {
      // Fetch neighbors
      const neighbors = await getNeighborResidents(id, floor, room);

      // If the unit doesn't contain any residents, show an error
      if (neighbors?.[0] == undefined) {
        console.log("error - no neighbors");
        setError("No neighbors registered.");
      }

      // Convert the data being returned from the API to the model the app uses
      let convertedNeighborArray: ResidentModel[] = [];
      neighbors?.forEach((neighbor) => {
        console.log(neighbor);
        const converted: ResidentModel = {
          name: neighbor.name,
          photo: neighbor.profilePhoto ? neighbor.profilePhoto : undefined,
          isConnected: neighbor.connected,
          neighborId: neighbor.residentId.toString(),
        };
        convertedNeighborArray.push(converted);
      });

      // Set the state of the neighbors to the array that was just fetched
      setNeighbors(convertedNeighborArray);
    } catch (error: any) {
      //console.log("Error fetching neighbors " + error);
      if (error.toString() == "does not exist or problem retrieving.") {
        setError("Problem retrieving.");
      } else {
        // console.log(error);
        setError("Couldn't load unit.");
      }
    }
  };

  // Hook on screen focus
  useFocusEffect(
    useCallback(() => {
      // Fetch residents
      fetchResidents();

      // Cleanup when unfocuesed
      return () => {
        setNeighbors(undefined);
      };
    }, [])
  ); //empty array to fetch only when it mounts

  // Doesn't need to be safe area view becuase index and profile are
  return (
    <SafeAreaView style={[styles.container, { paddingHorizontal: 20 }]}>
      <Text style={styles.unit}>
        Unit {floor}
        {room}
      </Text>
      <ScrollView>
        {neighbors?.map((resident) => (
          <TouchableOpacity
            key={resident.neighborId.toString()}
            style={styles.row}
          >
            <ResidentRow
              name={resident.name}
              photo={resident.photo}
              isConnected={resident.isConnected}
              neighborId={resident.neighborId}
            />
          </TouchableOpacity>
        ))}
        {error && <Warning message={error} />}
      </ScrollView>
    </SafeAreaView>
  );
};

// TODO: global styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    //justifyContent: "center",
    top: 50,
  },
  unit: {
    fontSize: 32,
    fontWeight: "200",
    fontFamily: "AlbertSans-ExtraLight",
    color: "#000",
    textAlign: "center",
    height: 60,
  },
  row: {
    alignSelf: "center",
    marginBottom: 15,
  },
});

export default Unit;
