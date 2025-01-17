import { Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { UUIDTypes } from "uuid";
import { useResidentStore } from "../../../state/ResidentStore";
import { getNeighborResidents } from "../../../util/APIService";
import { SafeAreaView } from "react-native-safe-area-context";
import ResidentRow from "../../../components/ResidentRow";
import Warning from "../../../components/Warning";

interface ResidentModel {
  name: string;
  photo?: string;
  isConnected: boolean;
  neighborId: UUIDTypes;
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

  //Do on load
  useEffect(() => {
    const fetchResidents = async () => {
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
        const converted: ResidentModel = {
          name: neighbor.name,
          photo: neighbor.profilePhoto ? neighbor.profilePhoto : undefined,
          isConnected: neighbor.connected,
          neighborId: neighbor.residentId,
        };
        convertedNeighborArray.push(converted);
      });

      // Set the state of the neighbors to the array that was just fetched
      setNeighbors(convertedNeighborArray);
    };

    fetchResidents();
  }, []); //empty array to fetch only when it mounts

  return (
    <SafeAreaView>
      <Text style={styles.unit}>
        Unit {floor}{room}
      </Text>
      <FlatList
        style={styles.row}
        data={neighbors}
        renderItem={({ item }) => (
          <ResidentRow
            name={item.name}
            photo={item.photo}
            isConnected={item.isConnected}
            neighborId={item.neighborId}
          />
        )}
        keyExtractor={(item) => item.name.toString()}
      />
      {error && <Warning message={error} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  unit: {
    fontSize: 32,
    fontWeight: "200",
    fontFamily: "AlbertSans-ExtraLight",
    color: "#000",
    textAlign: "center",
    height: 52,
  },
  row: {
    marginBottom: 30,
    alignSelf: "center",
    //display: "flex",
    //flex: 1,
    borderRadius: 10,
  },
});

export default Unit;