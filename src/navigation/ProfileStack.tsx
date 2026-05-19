import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '~/types/navigation';
import { ProfileScreen } from '~/screens/profile/ProfileScreen';
import { stackScreenOptions } from '~/theme/navigationTheme';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}
