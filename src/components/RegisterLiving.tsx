import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import { useRegisterStore } from "../state/RegisterStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getBuildings } from "../util/APIService";
import { Picker } from "@react-native-picker/picker";
import { getLease } from "../util/APIService";
import Warning from "./Warning";

// Define zod schema for form validation
const formSchema = z.object({
  street: z.string(),
  building: z.string(),
  floor: z.coerce
    .number()
    .min(0, { message: "Invalid number." })
    .max(1200, { message: "Invalid number." }),

  /////// For optionals
  test: z
    .string()
    .min(4, "Please enter a valid value")
    .optional()
    .or(z.literal("")),
  room: z.coerce
    .number()
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

  const handleStreet = async (value) => {
    try {
      const buildings = await getBuildings(value.nativeEvent.text);
      setBuildings(buildings);
      console.log(buildings);
      setStreetError(undefined);
    } catch (error) {
      setStreetError(error.toString());
    }
  };

  const handleBuilding = (value) => {
    if (
      buildings.toString().toLowerCase() == value.nativeEvent.text.toLowerCase()
    ) {
      console.log("exists");
      setBuildingError(undefined);
    } else {
      setBuildingError("Invalid building.");
      console.log("invalid");
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
  }) => {
    // safe parse the date, and if it's true, continue - don't need to do this, because the date time picker should
    //z.date().safeParse(date);

    // Get lease id from info
    try {

        console.log(startDate);
        console.log(endDate)
      let leaseId = await getLease(
        street,
        building,
        room,
        floor,
        startDate,
        endDate
      );

     
      if (leaseId != undefined) {setLiving(leaseId);

      // DON"T LET THEM CONTINUE IF ID IS UNDEFINED< SHOW WARNING

      router.push("register/personal")}
    } catch (error) {
      //TODO: handle errors
      console.log("Error" + error);
      setError(error);
    }
  };

  return (
    <View style={styles.container}>
      {streetError && (
        <Warning message="If problem persists, reach out to admin. Building may not be added." />
      )}
      {error && <Warning message={error.toString()} />}
      <View style={[styles.form]}>
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
                style={styles.input}
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
              {!errors.building && <Text style={styles.error}></Text>}
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
                  style={[styles.input, { width: "60%" }]}
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
                  style={[styles.input, { width: "60%" }]}
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
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    padding: 20,
    //justifyContent: "center",
    height: "100%",
    //verticalAlign: "middle",
    //backgroundColor: "yellow",
    alignContent: "center",
  },
  form: {
    width: "100%",
    padding: 24,
    minWidth: 320,
    borderColor: "#d9d9d9",
  },
  controller: {
    width: "100%",
  },
  input: {
    borderRadius: 8,
    backgroundColor: "#fff",
    borderStyle: "solid",
    borderColor: "#d9d9d9",
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
    //minWidth: 240,
    alignSelf: "stretch",
    marginBottom: 6,
  },
  // date: {
  //     borderRadius: 8,
  //        backgroundColor: "#fff",
  //     //   borderStyle: "solid",
  //     //   borderColor: "#d9d9d9",
  //     //   borderWidth: 1,
  //     //   overflow: "hidden",
  //        flexDirection: "row",
  //        alignItems: "flex-start",
  //       //paddingHorizontal: 16,
  //       //paddingVertical: 1,
  //       minWidth: 240,
  //       minHeight: 100,
  //        //alignSelf: "stretch",
  //     //   marginBottom: 6,
  // },
  label: {
    fontFamily: "Albert Sans",
    fontSize: 16,
    alignSelf: "stretch",
    color: "#1e1e1e",
    textAlign: "left",
    paddingBottom: 10,
  },
  error: {
    fontSize: 14,
    //lineHeight: 20,
    fontFamily: "Inter-Regular",
    color: "#cbc1f6",
    marginBottom: 12,
  },
  button: {
    top: 24,
    backgroundColor: "#8976ed",
    borderColor: "#8976ed",
    justifyContent: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    maxWidth: 150,
    height: 50,
  },
  buttonText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: "#f5f5f5",
    alignSelf: "center",
  },
  link: {
    fontSize: 16,
    lineHeight: 22,
    textDecorationLine: "underline",
    fontFamily: "Inter-Regular",
    color: "#1e1e1e",
    alignSelf: "center",
  },
  picker: {
    //height: 20,
  },
});
