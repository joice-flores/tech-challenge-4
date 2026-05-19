import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from '../types/navigation';
import { AdminPostsScreen } from '../screens/admin/AdminPostsScreen';
import { AdminPostsListScreen } from '../screens/admin/AdminPostsListScreen';
import { CreatePostScreen } from '../screens/admin/CreatePostScreen';
import { EditPostScreen } from '../screens/admin/EditPostScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { CreateUserScreen } from '../screens/admin/CreateUserScreen';
import { EditUserScreen } from '../screens/admin/EditUserScreen';
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
        name="AdminPostsList"
        component={AdminPostsListScreen}
        options={{ title: 'Posts' }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ title: 'Novo Post' }}
      />
      <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Editar Post' }} />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ title: 'Usuários' }}
      />
      <Stack.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={{ title: 'Novo Usuário' }}
      />
      <Stack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ title: 'Editar Usuário' }}
      />
    </Stack.Navigator>
  );
}
