import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/authService';
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
  LogoutButton,
  LogoutText,
} from './ProfileScreen.styles';

export function ProfileScreen() {
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
        <LogoutButton onPress={handleLogout} activeOpacity={0.7}>
          <LogoutText>Sair</LogoutText>
        </LogoutButton>
      </Actions>
    </Screen>
  );
}
