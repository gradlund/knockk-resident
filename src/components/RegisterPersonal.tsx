import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useRegisterStore } from "../state/RegisterStore";
import { styles } from "../assets/Stylesheet";

// Define zod schema for form validation
const formSchema = z.object({
  //nullable, mullish, optional
  //gender: z.enum(["Female", "Male", "Undisclosed"]), //required
  //age: z.number().nullish().min(3, {message: "Invalid age. Please enter age between 18 and 100."}),
  age:
    //   z.union([z.coerce.number().min(4, "Please enter a valid value"), z.coerce.number().max(100,{message: "Please enter a valid age."})])
    //   .optional()
    z.coerce
      .number()
      .min(18, "Please enter a valid value")
      .max(100, { message: "Please enter a valid age." })
      .or(z.literal(undefined))
      .or(z.literal(""))

      //.or(z.literal())
      //z.union([z.coerce.number().min(4, "Please enter a valid value"), z.coerce.number().max(100,{message: "Please enter a valid age."})], {message: "Invalid age."})
      //.optional()
      .transform((e) => (e === "" || e === undefined ? undefined : e)),
  //.or(z.literal(0))
  // .or(z.literal(0))
  hometown: z
    .string()
    .max(75, { message: "Too long. Under 75 characters." })
    .or(z.literal(""))
    .or(z.literal(undefined)) // if they never typed anything
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
  biography: z
    .string()
    .max(200, { message: "Too long. Under 200 characters." })
    .or(z.literal(""))
    .or(z.literal(undefined)) // if they never typed anything
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
});

// If the values are undefined, and the user doesn't change it, it'll be stored as undefined in the database... otherwise if "", it'll return null
export const RegisterPersonal = () => {
  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      age: undefined,
      hometown: "",
      biography: "",
    },
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { setPersonal } = useRegisterStore();

  // Should make enum
  const genders = ["Female", "Male", "Undisclosed"];
  const [gender, setGender] = useState<String>("Undisclosed");

  // Save personal information and continue registering
  const handleContinue = ({
    age,
    hometown,
    biography,
  }: {
    age: number;
    hometown: string;
    biography: string;
  }) => {
    setPersonal(gender!, age, hometown, biography);
    router.push("register/photo");
  };

  return (
    <View style={[styles.GeneralContainer, { flex: 8 }]}>
      <View style={{ top: -30 }}>
        <View style={{ paddingBottom: 20 }}>
          <Text style={styles.label}>Gender</Text>
          {genders.map((item) => (
            <TouchableOpacity
              key={item}
              style={{ paddingBottom: 4 }}
              onPress={() => {
                setGender(item);
              }}
            >
              <Text style={{ left: 20, height: 20 }}>
                {item} {gender == item && <Text>X</Text>}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Controller
          control={control}
          name="age"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="0"
              />
              {errors.age && (
                <Text style={styles.error}>{errors.age.message}</Text>
              )}
              {!errors.age && <Text style={styles.error}></Text>}
            </>
          )}
        />
        <Controller
          control={control}
          name="hometown"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Hometown</Text>
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value}
                placeholder="Place"
              />
              {errors.hometown && (
                <Text style={styles.error}>{errors.hometown.message}</Text>
              )}
              {!errors.hometown && <Text style={styles.error}></Text>}
            </>
          )}
        />
        <Controller
          control={control}
          name="biography"
          render={({ field: { onChange, value } }) => (
            <>
              <Text style={styles.label}>Biography</Text>
              <TextInput
                style={[styles.input, { height: 100, maxWidth: 300 }]}
                onChangeText={onChange}
                value={value}
                placeholder="Biography"
                multiline={true}
              />
              <Text style={{ alignSelf: "flex-end" }}>
                {value ? value.length : 0}/200
              </Text>
              {errors.biography && (
                <Text style={styles.error}>{errors.biography.message}</Text>
              )}
              {!errors.biography && <Text style={styles.error}></Text>}
            </>
          )}
        />
        <TouchableOpacity
          style={[styles.button, { top: -5 }]}
          onPress={handleSubmit(handleContinue)}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <Link style={[styles.link, { top: 5 }]} href="/register/photo">
          Skip
        </Link>
      </View>
    </View>
  );
};
