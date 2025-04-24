import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { styles } from "../../assets/Stylesheet";
import { FormComponent } from "../../components/FormComponent";
import { Warning } from "../../components/Warning";
import { RegisterState, useRegisterStore } from "../../state/RegisterStore";
import { register } from "../../util/APIService";

// Define zod schema for form validation
const formSchema = z.object({
  instagram: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
  snapchat: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
  x: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
  facebook: z.coerce
    .string()
    .max(100, { message: "Too long. Under 75 characters." })
    .or(z.literal(undefined)) // if they've never typed anything
    .or(z.literal(""))
    .transform((e) => (e === "" || e === undefined ? undefined : e)),
});

// social screen (RegisterSocialDetails)
const social = () => {
  //Initialize the form with hook form and zod schema resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      instagram: "",
      snapchat: "",
      x: "",
      facebook: "",
    },
    // Form will be validated against schema before submission
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const { setSocials } = useRegisterStore();
  const { getResidentInfo } = useRegisterStore();
  const [error, setError] = useState<String>(
    "The following information is voluntary and will show up once you connect with a neighbor."
  );

  // Register the account and route to sign-in
  const handleContinue = async ({
    instagram,
    snapchat,
    x,
    facebook,
  }: {
    instagram: string;
    snapchat: string;
    x: string;
    facebook: string;
  }) => {
    // Add socials to the store
    setSocials(instagram, snapchat, x, facebook);
    // Get the resident
    const resident: RegisterState = getResidentInfo();

    try {
      // Register the resident
      await register(resident);

      // push to login
      router.push("sign-in");
    } catch (error: any) {
      if (error.toString().includes("Problem")) {
        setError("Problem registering. Please contact admin.");
      } else {
        setError("An error occurred. Please try again later.");
      }

      console.error(error.toString());
    }
  };

  return (
    <View style={[]}>
      <View style={{ top: 20, paddingBottom: 10, position: "absolute" }}>
        <Warning message={error.toString()} />
      </View>
      <View style={[{ top: 150 }]}>
        <View>
          <FormComponent
            control={control}
            name="instagram"
            label="Instagram"
            error={errors.instagram}
            screen="social"
            placeholder=""
          />

          <FormComponent
            control={control}
            name="snapchat"
            label="Snapchat"
            error={errors.snapchat}
            screen="social"
            placeholder=""
          />

          <FormComponent
            control={control}
            name="x"
            label="X"
            error={errors.x}
            screen="social"
            placeholder=""
          />

          <FormComponent
            control={control}
            name="facebook"
            label="Facebook"
            error={errors.facebook}
            screen="social"
            placeholder=""
          />
          <TouchableOpacity
            style={[styles.button, { top: 60 }]}
            onPress={handleSubmit(handleContinue)}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit(handleContinue)}>
            <Text style={[styles.link, { top: 70 }]}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default social;
