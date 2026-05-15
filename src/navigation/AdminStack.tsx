import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../types/navigation';
import { AdminPostsScreen } from '../screens/admin/AdminPostsScreen';
import { stackScreenOptions } from '../theme/navigationTheme';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="AdminPosts"
        component={AdminPostsScreen}
        options={{ title: 'Administração' }}
      />
    </Stack.Navigator>
  );
}
