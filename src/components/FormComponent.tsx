import { Control, Controller, ControllerRenderProps, FieldError, FieldValues, Path } from "react-hook-form"
import { styles } from "../assets/Stylesheet"
import React from "react"
import { Text, TextInput } from "react-native"

interface InputProps<T extends FieldValues>  {
control: Control<T>,
name: keyof T;
error?: {message?: string}
label: string
screen: string
}
export const FormComponent = <T extends FieldValues>({control, name, error, label, screen}: InputProps<T>) => {

    return(
    <Controller
            control={control}
            name={name as Path<T>}
            render={({ field: { onChange, value } }) => (
              <>
                <Text style={styles.label}>{label}</Text>
                {screen == "login" && name == "password" && (
                    <TextInput
                    style={[styles.input, {width: 250, maxWidth: 250}]}
                    onChangeText={onChange}
                    value={value}
                    placeholder=""
                    secureTextEntry={true}
                  />
                     
                )}
                {screen == "login" && name == "email" && (
                    <TextInput
                    style={[styles.input, {width: 250, maxWidth: 250}]}
                    onChangeText={onChange}
                    value={value}
                    placeholder=""
                  />
                     
                )}
                {(name != "password" && screen != "login") &&
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  placeholder=""
                />}
                {error?.message && (
                  <Text style={styles.error}>{error.message}</Text>
                )}
                {!error?.message && <Text style={styles.error}></Text>}
              </>
            )}
          />
        )
}