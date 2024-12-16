import { View, Text, Image } from "react-native";
import { useResidentStore } from "../../state/ResidentStore";

// Login screen
const Login = () => {
  const { resident } = useResidentStore();

  return (
    <View>
      <Text>{resident}</Text>
    </View>
  );
};

export default Login;
