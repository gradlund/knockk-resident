import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { styles } from "../../assets/Stylesheet";
import Warning from "../../components/Warning";
import { useRegisterStore } from "../../state/RegisterStore";
import { getBuildings, getLease } from "../../util/APIService";

// Define zod schema for form validation
const formSchema = z.object({
  street: z.string(),
  building: z.string(),
  floor: z.coerce
    .number({ message: "Invalid. Enter a number." })
    .min(0, { message: "Invalid number." })
    .max(1200, { message: "Invalid number." }),
  room: z.coerce
    .number({ message: "Invalid. Enter a number." })
    .min(0, { message: "Invalid number." })
    .max(500, { message: "Invalid number." }),
  startDate: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .min(new Date("1920-01-01"), { message: "Too old" }),
  endDate: z
    .date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
    .min(new Date("1920-01-01"), { message: "Too old" }), // min should be start date
});

// living screen (RegisterLivingDetails)
const living = () => {
  const router = useRouter();

  const { setLiving } = useRegisterStore();

  //const [building, setBuilding] = useState<String>();
  const [error, setError] = useState<String>();
  const [buildings, setBuildings] = useState<String[]>([""]);
  const [streetError, setStreetError] = useState<String>();
  const [buildingError, setBuildingError] = useState<String>();

  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      street: "",
      building: "",
      floor: 0,
      room: 0,
      startDate: new Date(),
      endDate: new Date(),
    },
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
  });

  // Makes sure the street is valid
  // Retrieves the buildings
  const handleStreet = async (
    address: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    try {
      // Retrieve all the buildings with that street
      const buildings: [String] = await getBuildings(address.nativeEvent.text);

      // If no buildings are return, show an error
      // The user probably entered something wron.
      if (buildings == undefined) {
        setStreetError("Street could not be found.");
        console.log("Invalid street");
      }
      // Otherwise, set all the errors to false, and set the buildings to the data that was returned
      else {
        setError(undefined);
        setStreetError(undefined);
        setBuildings(buildings);
      }
    } catch (error: any) {
      setStreetError(error.toString());
    }
  };

  // Makes sure the building name is valid
  const handleBuilding = (
    building: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    // Check if what the user typed, matches a building that was returned
    if (
      buildings
        .toString()
        .toLowerCase()
        .includes(building.nativeEvent.text.toLowerCase())
    ) {
      setBuildingError(undefined);
      console.log("Buildings exists");
    }
    // If it does not, show an error
    else {
      setBuildingError("Invalid building.");
      console.log("Invalid");
    }
  };

  //Handle form submission
  //ASYNC??
  const handleContinue = async ({
    street,
    building,
    room,
    floor,
    startDate,
    endDate,
  }: {
    street: string;
    building: string;
    room: number;
    floor: number;
    startDate: Date;
    endDate: Date;
  }) => {
    // Get lease id
    try {
      // Retrieve lease id from lease detail
      let leaseId = await getLease(
        street,
        building,
        room,
        floor,
        startDate,
        endDate
      );

      // If the lease exists
      if (leaseId != undefined) {
        // Store the lease id
        setLiving(leaseId);

        router.push("register/personal");
      } else {
        setError("A problem occurred. Try again later.");
      }
    } catch (error: any) {
      setError("Lease does not exist");
      console.error(error.toString());
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.GeneralContainer, { paddingHorizontal: 50 }]}>
        <View>
          {streetError && !error && (
            <View style={{ paddingBottom: 20 }}>
              <Warning
                message={
                  "If problem persists, reach out to admin. Building may not be added."
                }
              />
            </View>
          )}
          {error && (
            <View style={{ paddingBottom: 20 }}>
              <Warning message={error.toString()} />
            </View>
          )}
          {!error && !streetError && (
            <View style={{ paddingBottom: 90 }}></View>
          )}
          <View>
            <Controller
              control={control}
              name="street"
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.label}>Street</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="123 Street"
                    onEndEditing={handleStreet}
                  />
                  {errors.street && (
                    <Text style={styles.error}>{errors.street.message}</Text>
                  )}
                  {streetError && (
                    <Text style={styles.error}>{streetError}</Text>
                  )}
                  {!errors.street && !streetError && (
                    <Text style={styles.error}></Text>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="building"
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.label}>Building</Text>
                  <TextInput
                    style={[styles.input]}
                    onChangeText={onChange}
                    value={value}
                    placeholder=""
                    onEndEditing={handleBuilding}
                  />
                  {errors.building && (
                    <Text style={styles.error}>{errors.building.message}</Text>
                  )}
                  {buildingError && (
                    <Text style={styles.error}>{buildingError}</Text>
                  )}
                  {!errors.building && !buildingError && (
                    <Text style={styles.error}></Text>
                  )}
                </>
              )}
            />

            <View style={{ flexDirection: "row" }}>
              <Controller
                control={control}
                name="floor"
                render={({ field: { onChange, value } }) => (
                  <View style={{ flexDirection: "column", width: "50%" }}>
                    <Text style={styles.label}>Floor</Text>
                    <TextInput
                      style={[styles.input, { width: "60%", minWidth: 40 }]}
                      onChangeText={onChange}
                      value={value.toString()}
                      placeholder="0"
                    />
                    {errors.floor && (
                      <Text style={styles.error}>{errors.floor.message}</Text>
                    )}
                    {!errors.floor && <Text style={styles.error}></Text>}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="room"
                render={({ field: { onChange, value } }) => (
                  <View style={{ flexDirection: "column", width: "50%" }}>
                    <Text style={styles.label}>Room</Text>
                    <TextInput
                      style={[styles.input, { width: "60%", minWidth: 20 }]}
                      onChangeText={onChange}
                      value={value.toString()}
                      placeholder="0"
                    />
                    {errors.room && (
                      <Text style={styles.error}>{errors.room.message}</Text>
                    )}
                    {!errors.room && <Text style={styles.error}></Text>}
                  </View>
                )}
              />
            </View>
            <Controller
              control={control}
              name="startDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.label}>Start Date</Text>
                  <DateTimePicker
                    //style={styles.date}
                    onChange={(selectedDate) => {
                      if (selectedDate) {
                        // Need to convert DateTimePicker type date
                        let newDate: Date = new Date(
                          selectedDate.nativeEvent.timestamp
                        );
                        onChange(newDate);
                      }
                    }}
                    value={value}
                    mode="date"
                    display="default"
                  />
                  {errors.startDate && (
                    <Text style={styles.error}>{errors.startDate.message}</Text>
                  )}
                  {!errors.startDate && <Text style={styles.error}></Text>}
                </>
              )}
            />
            <Controller
              control={control}
              name="endDate"
              render={({ field: { onChange, value } }) => (
                <>
                  <Text style={styles.label}>End Date</Text>
                  <DateTimePicker
                    //style={styles.date}
                    onChange={(selectedDate) => {
                      if (selectedDate) {
                        // Need to convert DateTimePicker type date
                        let newDate: Date = new Date(
                          selectedDate.nativeEvent.timestamp
                        );
                        onChange(newDate);
                      }
                    }}
                    value={value}
                    mode="date"
                    display="default"
                  />
                  {errors.endDate && (
                    <Text style={styles.error}>{errors.endDate.message}</Text>
                  )}
                  {!errors.endDate && <Text style={styles.error}></Text>}
                </>
              )}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(handleContinue)}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default living;
