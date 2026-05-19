import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackActions } from '@react-navigation/native';
import { BookOpen, Settings, User } from 'lucide-react-native';
import { RootTabParamList } from '~/types/navigation';
import { PostsStack } from './PostsStack';
import { AdminStack } from './AdminStack';
import { ProfileStack } from './ProfileStack';
import { useAuth } from '~/contexts/AuthContext';
import { tabBarOptions } from '~/theme/navigationTheme';

const Tab = createBottomTabNavigator<RootTabParamList>();

type TabBarIconProps = { color: string; size: number };

export function AppTabs() {
  const { isTeacher, isAdmin } = useAuth();
  const isTeacherOrAdmin = isTeacher || isAdmin;

  return (
    <Tab.Navigator screenOptions={{ headerShown: false, ...tabBarOptions }}>
      <Tab.Screen
        name="PostsTab"
        component={PostsStack}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            const s = (route as { state?: { key: string } }).state;
            if (s) navigation.dispatch({ ...StackActions.popToTop(), target: s.key });
          },
        })}
        options={{
          title: 'Posts',
          tabBarIcon: ({ color, size }: TabBarIconProps) => <BookOpen color={color} size={size} />,
        }}
      />
      {isTeacherOrAdmin && (
        <Tab.Screen
          name="AdminTab"
          component={AdminStack}
          listeners={({ navigation, route }) => ({
            tabPress: () => {
              const s = (route as { state?: { key: string } }).state;
              if (s) navigation.dispatch({ ...StackActions.popToTop(), target: s.key });
            },
          })}
          options={{
            title: 'Admin',
            tabBarIcon: ({ color, size }: TabBarIconProps) => (
              <Settings color={color} size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            const s = (route as { state?: { key: string } }).state;
            if (s) navigation.dispatch({ ...StackActions.popToTop(), target: s.key });
          },
        })}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }: TabBarIconProps) => <User color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
