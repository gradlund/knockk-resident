import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useAuth } from '../../providers/auth-provider';
import { useResidentStore } from '../../state/ResidentStore';

export default function AppLayout() {
  const { mounting } = useAuth();
  const { resident } = useResidentStore()

  // You can keep the splash screen open, or render a loading screen like we do here.
  // if (mounting) {
  //   return <Text>Loading...</Text>;
  // }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!resident) {
    //Redirect to sign in if not logged in
    return <Redirect href="/sign-in" />;
  }

  return <Stack />;
}

