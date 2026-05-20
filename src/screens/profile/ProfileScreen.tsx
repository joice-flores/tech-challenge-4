import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '~/contexts/AuthContext';
import { logout } from '~/services/authService';
import { ProfileStackParamList } from '~/types/navigation';
import {
  Screen,
  Header,
  Info,
  RoleLabel,
  Avatar,
  AvatarText,
  Name,
  Email,
  Actions,
  EditButton,
  EditButtonText,
  LogoutButton,
  LogoutText,
} from './ProfileScreen.styles';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'Profile'>;

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // network errors shouldn't block local sign-out
    } finally {
      await signOut();
    }
  }

  const roleLabel =
    user?.role === 'teacher' ? 'Professor' : user?.role === 'admin' ? 'Administrador' : 'Aluno';
  const initials = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <Screen>
      <Header>
        <Avatar>
          <AvatarText>{initials}</AvatarText>
        </Avatar>
      </Header>
      <Info>
        {user && <RoleLabel>{roleLabel}</RoleLabel>}
        <Name>{user?.name ?? '—'}</Name>
        <Email>{user?.email ?? '—'}</Email>
      </Info>

      <Actions>
        <EditButton onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.7}>
          <EditButtonText>Editar perfil</EditButtonText>
        </EditButton>
        <LogoutButton onPress={handleLogout} activeOpacity={0.7}>
          <LogoutText>Sair</LogoutText>
        </LogoutButton>
      </Actions>
    </Screen>
  );
}
