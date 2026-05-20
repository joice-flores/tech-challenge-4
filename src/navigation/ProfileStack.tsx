import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '~/types/navigation';
import { ProfileScreen } from '~/screens/profile/ProfileScreen';
import { EditProfileScreen } from '~/screens/profile/EditProfileScreen';
import { stackScreenOptions } from '~/theme/navigationTheme';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Editar Perfil' }}
      />
    </Stack.Navigator>
  );
}
