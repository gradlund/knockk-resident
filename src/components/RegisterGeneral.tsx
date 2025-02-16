import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { z } from "zod";
import { useRegisterStore } from "../state/RegisterStore";
import { registerAccount } from "../util/APIService";
import Warning from "./Warning";


// Define zod schema for form validation
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: 
  z.string({message: "First name is required. Letters only."})
  .min(2, { message: "Must be longer than 2 characters."})
  .max(20, {message: "Must be less than 20 characters."}),
  lastName: z
  .string({message: "Last name is required. Letters only."})
  .min(2, { message: "Must be longer than 2 characters."})
  .max(20, {message: "Must be less than 20 characters."}),
  password: z
    .string()
    .min(8, { message: "Password must be more than 8 characters." })
    .max(25, { message: "Password is too long. Under 25 characters." }),

});

//TODO: call the create account method and get the id. Save that
export const RegisterGeneral = () => {
// State for errors
//const [valid, setValid] = useState(true);

const router = useRouter();

const {setGeneral} = useRegisterStore();

const [error, setError] = useState<String>();

//Initialize the form with hook form and zod schema resolver
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
    defaultValues: {
        email: undefined,
        firstName: undefined, 
        lastName: undefined,
        password: undefined,
    },
  //form will be validated against schema before submission
  resolver: zodResolver(formSchema),
});

//Handle form submission
const handleContinue = async ({ email, firstName, lastName, password }) => {

    try{
    const id = await registerAccount(email, password);
    console.log(id)
   
    setGeneral(id, email, firstName, lastName, password);
    router.push("register/living")
    //setError(undefined)
    }
    catch(error){
        setError(error);
    }
};

return (
  <View style={styles.container}>
    <View style={[styles.form]}>
    
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="johndoe@gmail.com"
            />
            {error && !errors.email && <Text style={[styles.error, {position: "absolute", top: 116, left: 25}]}>{error.toString()}</Text>}
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
            
            {!errors.email && <Text style={styles.error}></Text>}
            
            
          </>
        )}
      />
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={styles.label}>First</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="John"
            />
            {errors.firstName && (
              <Text style={styles.error}>{errors.firstName.message}</Text>
            )}
            {!errors.firstName && <Text style={styles.error}></Text>}
          </>
        )}
      />
<Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder="Doe"
            />
            {errors.lastName && (
              <Text style={styles.error}>{errors.lastName.message}</Text>
            )}
            {!errors.lastName && <Text style={styles.error}></Text>}
          </>
        )}
      />
       <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                      secureTextEntry={true}
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      placeholder="password"
                    />
                    {errors.password && (
                      <Text style={styles.error}>{errors.password.message}</Text>
                    )}
                    {!errors.password && <Text style={styles.error}></Text>}
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
      //flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
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
      minWidth: 240,
      alignSelf: "stretch",
      marginBottom: 6,
    },
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
  });
