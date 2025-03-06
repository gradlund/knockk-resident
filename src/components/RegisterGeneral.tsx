import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { z } from "zod";
import { useRegisterStore } from "../state/RegisterStore";
import { registerAccount } from "../util/APIService";
import Warning from "./Warning";
import { styles } from "../assets/Stylesheet";
import {FormComponent} from "./FormComponent"


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
  <View style={styles.GeneralContainer}>
    <View style={[{paddingTop: 60}]}>
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
            {error && !errors.email && <Text style={[styles.error]}>{error.toString()}</Text>}
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
            
            {!error && !errors.email && <Text style={styles.error}></Text>}
            

          </>
        )}
      />
      <FormComponent control={control} screen="register" name="firstName" label="First Name" error={errors.firstName}></FormComponent>
      {/* <Controller
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
      /> */}
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
        style={[styles.button, {top: 90}]}
        onPress={handleSubmit(handleContinue)}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};


