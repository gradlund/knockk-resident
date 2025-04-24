import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { styles } from "../../assets/Stylesheet";
import { FormComponent } from "../../components/FormComponent";
import { Warning } from "../../components/Warning";
import { useRegisterStore } from "../../state/RegisterStore";

// Define zod schema for form validation
const formSchema = z.object({
  //nullable, mullish, optional
  //gender: z.enum(["Female", "Male", "Undisclosed"]), //required
  age: z.coerce
    .number()
    .min(18, "Age must be greater than 18.")
    .max(100, { message: "Age must be less than 100." })
    .or(z.literal(undefined))
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
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

// personal screen (RegisterPersonalDetails)
const personal = () => {
  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      age: 0, //was undefined before
      hometown: "",
      biography: "",
    },
    //form will be validated against schema before submission
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { setPersonal } = useRegisterStore();

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
    // Store personal information to the store and continue registration
    setPersonal(gender!, age, hometown, biography);
    console.log(gender!);
    router.push("register/photo");
  };

  return (
    <View style={{ flex: 10, justifyContent: "center" }}>
      <View style={{ top: 20, flex: 2 }}>
        <Warning
          message={
            "The following information is voluntary and will show up once you connect with a neighbor."
          }
        />
      </View>
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
          <FormComponent
            control={control}
            name="age"
            label="Age"
            error={errors.age}
            screen="personal"
            placeholder="0"
          />
          <FormComponent
            control={control}
            name="hometown"
            label="Hometown"
            error={errors.hometown}
            screen="personal"
            placeholder=""
          />
          {/* Kept this contoller because it has the length characters */}

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
                  //placeholder="Biography"
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
    </View>
  );
};

export default personal;
