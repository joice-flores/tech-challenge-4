import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminStackParamList } from '~/types/navigation';
import { AdminScreen } from '~/screens/admin/AdminScreen/AdminScreen';
import { AdminPostsListScreen } from '~/screens/admin/AdminPostListScreen/AdminPostsListScreen';
import { CreatePostScreen } from '~/screens/admin/CreatePostScreen/CreatePostScreen';
import { EditPostScreen } from '~/screens/admin/EditPostScreen/EditPostScreen';
import { AdminUsersScreen } from '~/screens/admin/AdminUsersScreen/AdminUsersScreen';
import { stackScreenOptions } from '~/theme/navigationTheme';

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen
        name="AdminPosts"
        component={AdminScreen}
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
    </Stack.Navigator>
  );
}
