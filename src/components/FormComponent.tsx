import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Text, TextInput } from "react-native";
import { styles } from "../assets/Stylesheet";

// Interface for props
interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: keyof T;
  error?: { message?: string };
  label: string;
  placeholder: string;
  screen: string;
}

// Form Component
export const FormComponent = <T extends FieldValues>({
  control,
  name,
  error,
  label,
  placeholder,
  screen,
}: InputProps<T>) => {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field: { onChange, value } }) => (
        <>
          <Text style={styles.label}>{label}</Text>
          {/* Shouldn't have value text */}
          {screen == "login" && name == "password" && (
            <TextInput
              style={[styles.input, { width: 250, maxWidth: 250 }]}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              secureTextEntry={true}
            />
          )}
          {screen == "register" && name == "password" && (
            <TextInput
              style={[styles.input]}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
              secureTextEntry={true}
            />
          )}
          {screen == "login" && name == "email" && (
            <TextInput
              style={[styles.input, { width: 250, maxWidth: 250 }]}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
            />
          )}
          {name != "password" && screen != "login" && (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder}
            />
          )}
          {error?.message && <Text style={styles.error}>{error.message}</Text>}
          {!error?.message && <Text style={styles.error}></Text>}
        </>
      )}
    />
  );
};
