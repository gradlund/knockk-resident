import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, FieldValue, useForm } from "react-hook-form";
import {
  NativeSyntheticEvent,
  Text,
  TextInput,
  TextInputEndEditingEventData,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { useRegisterStore } from "../state/RegisterStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getBuildings } from "../util/APIService";
import { getLease } from "../util/APIService";
import Warning from "./Warning";
import { styles } from "../assets/Stylesheet";

// Define zod schema for form validation
const formSchema = z.object({
  street: z.string(),
  building: z.string(),
  floor: z.coerce
    .number({ message: "Invalid. Enter a number." })
    .min(0, { message: "Invalid number." })
    .max(1200, { message: "Invalid number." }),

  /////// For optionals
  // test: z
  //   .string()
  //   .min(4, "Please enter a valid value")
  //   .optional()
  //   .or(z.literal("")),
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
  //.default(new Date())
});

export const RegisterLiving = () => {
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
  const handleStreet = async (
    address: NativeSyntheticEvent<TextInputEndEditingEventData>
  ) => {
    try {
      const buildings: [String] = await getBuildings(address.nativeEvent.text);

      if (buildings == undefined) {
        setStreetError("Street could not be found.");
      } else {
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
    if (
      buildings
        .toString()
        .toLowerCase()
        .includes(building.nativeEvent.text.toLowerCase())
    ) {
      console.log("exists");
      setBuildingError(undefined);
    } else {
      setBuildingError("Invalid building.");
      console.log("invalid");
    }
    console.log(building.nativeEvent.text.toLowerCase());
    console.log(buildings.toString().toLowerCase());
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
    // safe parse the date, and if it's true, continue - don't need to do this, because the date time picker should
    //z.date().safeParse(date);

    // Get lease id from info
    try {
      // Retrieve lease id
      let leaseId = await getLease(
        street,
        building,
        room,
        floor,
        startDate,
        endDate
      );

      if (leaseId != undefined) {
        setLiving(leaseId);

        // DON"T LET THEM CONTINUE IF ID IS UNDEFINED< SHOW WARNING

        router.push("register/personal");
      }
    } catch (error: any) {
      setError("Lease " + error.toString());
    }
  };

  return (
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
        {!error && !streetError && <View style={{ paddingBottom: 90 }}></View>}
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
                {streetError && <Text style={styles.error}>{streetError}</Text>}
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

          {/* PICKER DROPDOWN ONLY WORKS FOR ANDROID 
{buildings &&
<Picker
style={[styles.picker, {overflow: "hidden",}]}
mode="dropdown"
dropdownIconColor={"blue"}
  selectedValue={building}
  onValueChange={(itemValue, itemIndex) =>
    setBuilding(itemValue)
  }>

<Picker.Item key="hi" label="bye" value="bye" />
<Picker.Item key="hi2" label="bye2" value="bye2" />
<Picker.Item key="hi3" label="bye3" value="bye3" />

{/* {buildings.map((item) => (
    <Picker.Item key={item.toString()} label={item.toString()} value={item.toString()} />
))} 
</Picker>
} */}

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
                  //placeholder="Select date"
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
                  //placeholder="Select date"
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
  );
};
