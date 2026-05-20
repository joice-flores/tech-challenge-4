import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from '~/screens/profile/ProfileScreen';
import * as AuthContext from '~/contexts/AuthContext';
import * as authService from '~/services/authService';

const mockSignOut = jest.fn();
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('~/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('~/services/authService', () => ({
  logout: jest.fn(),
}));

const mockUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao@test.com',
  role: 'teacher' as const,
};

beforeEach(() => {
  jest.clearAllMocks();
  (AuthContext.useAuth as unknown as jest.Mock).mockReturnValue({
    user: mockUser,
    signOut: mockSignOut,
    updateProfile: jest.fn(),
  });
});

describe('ProfileScreen', () => {
  it('renders avatar initial, name, email and role badge', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('J')).toBeTruthy();
    expect(screen.getByText('João Silva')).toBeTruthy();
    expect(screen.getByText('joao@test.com')).toBeTruthy();
    expect(screen.getByText('Professor')).toBeTruthy();
  });

  it('shows "Aluno" badge for student role', () => {
    (AuthContext.useAuth as unknown as jest.Mock).mockReturnValue({
      user: { ...mockUser, role: 'student' as const },
      signOut: mockSignOut,
      updateProfile: jest.fn(),
    });
    render(<ProfileScreen />);
    expect(screen.getByText('Aluno')).toBeTruthy();
  });

  it('renders edit and logout buttons', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Editar perfil')).toBeTruthy();
    expect(screen.getByText('Sair')).toBeTruthy();
  });

  it('navigates to EditProfile on edit press', () => {
    render(<ProfileScreen />);
    fireEvent.press(screen.getByText('Editar perfil'));
    expect(mockNavigate).toHaveBeenCalledWith('EditProfile');
  });

  it('renders fallbacks when user is null', () => {
    (AuthContext.useAuth as unknown as jest.Mock).mockReturnValue({
      user: null,
      signOut: mockSignOut,
      updateProfile: jest.fn(),
    });
    render(<ProfileScreen />);
    expect(screen.getByText('?')).toBeTruthy();
    expect(screen.getAllByText('—')).toHaveLength(2);
  });

  it('calls logout service and signOut on press', async () => {
    (authService.logout as unknown as jest.Mock).mockResolvedValueOnce(undefined);
    mockSignOut.mockResolvedValueOnce(undefined);

    render(<ProfileScreen />);
    fireEvent.press(screen.getByText('Sair'));

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalledTimes(1);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });

  it('still calls signOut even when logout service fails', async () => {
    (authService.logout as unknown as jest.Mock).mockRejectedValueOnce(new Error('network'));
    mockSignOut.mockResolvedValueOnce(undefined);

    render(<ProfileScreen />);
    fireEvent.press(screen.getByText('Sair'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
  });
});
