import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ProfileScreen } from '~/screens/profile/ProfileScreen';
import * as AuthContext from '~/contexts/AuthContext';
import * as authService from '~/services/authService';

const mockSignOut = jest.fn();

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
    });
    render(<ProfileScreen />);
    expect(screen.getByText('Aluno')).toBeTruthy();
  });

  it('renders logout button', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Sair')).toBeTruthy();
  });

  it('renders fallbacks when user is null', () => {
    (AuthContext.useAuth as unknown as jest.Mock).mockReturnValue({
      user: null,
      signOut: mockSignOut,
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
