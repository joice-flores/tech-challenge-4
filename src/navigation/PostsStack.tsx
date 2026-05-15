import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostsStackParamList } from '../types/navigation';
import { PostListScreen } from '../screens/posts/PostListScreen';
import { PostDetailScreen } from '../screens/posts/PostDetailScreen';
import { stackScreenOptions } from '../theme/navigationTheme';

const Stack = createNativeStackNavigator<PostsStackParamList>();

export function PostsStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="PostList" component={PostListScreen} options={{ title: 'Posts' }} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
    </Stack.Navigator>
  );
}
