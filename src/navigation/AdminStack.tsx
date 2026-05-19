import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../types/navigation';
import { AdminPostsScreen } from '../screens/admin/AdminPostsScreen';
import { CreatePostScreen } from '../screens/admin/CreatePostScreen';
import { EditPostScreen } from '../screens/admin/EditPostScreen';
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
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'Novo Post' }}
      />
      <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Editar Post' }} />
    </Stack.Navigator>
  );
}
