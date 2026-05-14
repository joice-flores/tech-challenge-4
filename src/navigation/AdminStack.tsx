import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../types/navigation';
import { AdminPostsScreen } from '../screens/admin/AdminPostsScreen';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminPosts"
        component={AdminPostsScreen}
        options={{ title: 'Administração' }}
      />
    </Stack.Navigator>
  );
}
