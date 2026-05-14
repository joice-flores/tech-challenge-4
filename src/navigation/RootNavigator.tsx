import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';

export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return <NavigationContainer>{isAuthenticated ? <AuthStack /> : <AppTabs />}</NavigationContainer>;
}
