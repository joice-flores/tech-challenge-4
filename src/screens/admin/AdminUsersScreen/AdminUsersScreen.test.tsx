import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AdminUsersScreen } from './AdminUsersScreen';
import * as userService from '~/services/userService';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: (cb: () => () => void) =>
    (jest.requireActual('react') as typeof import('react')).useEffect(cb, []),
}));

jest.mock('~/services/userService', () => ({
  fetchUsers: jest.fn(),
  deleteUser: jest.fn(),
}));

const mockUsers = [
  { id: '1', name: 'Ana Silva', email: 'ana@example.com', role: 'admin' },
  { id: '2', name: 'Carlos Souza', email: 'carlos@example.com', role: 'user' },
];

beforeEach(() => {
  jest.clearAllMocks();
  (userService.fetchUsers as jest.Mock).mockResolvedValue(mockUsers);
});

describe('AdminUsersScreen', () => {
  it('renders list of users after loading', async () => {
    render(<AdminUsersScreen />);
    expect(await screen.findByText('Ana Silva')).toBeTruthy();
    expect(screen.getByText('Carlos Souza')).toBeTruthy();
  });

  it('shows empty state when no users', async () => {
    (userService.fetchUsers as jest.Mock).mockResolvedValue([]);
    render(<AdminUsersScreen />);
    expect(await screen.findByText('Nenhum usuário encontrado.')).toBeTruthy();
  });

  it('navigates to CreateUser on FAB press', async () => {
    render(<AdminUsersScreen />);
    await screen.findByText('Ana Silva');
    fireEvent.press(screen.getByText('+'));
    expect(mockNavigate).toHaveBeenCalledWith('CreateUser');
  });

  it('navigates to EditUser for the correct user', async () => {
    render(<AdminUsersScreen />);
    await screen.findByText('Ana Silva');
    fireEvent.press(screen.getByLabelText('Editar Ana Silva'));
    expect(mockNavigate).toHaveBeenCalledWith('EditUser', { id: '1' });
  });

  it('shows confirmation modal on delete press', async () => {
    render(<AdminUsersScreen />);
    await screen.findByText('Ana Silva');
    fireEvent.press(screen.getByLabelText('Excluir Ana Silva'));
    expect(await screen.findByText('Excluir usuário')).toBeTruthy();
    expect(screen.getByText(/Tem certeza que deseja excluir "Ana Silva"/)).toBeTruthy();
  });

  it('closes modal on cancel press', async () => {
    render(<AdminUsersScreen />);
    await screen.findByText('Ana Silva');
    fireEvent.press(screen.getByLabelText('Excluir Ana Silva'));
    await screen.findByText('Excluir usuário');
    fireEvent.press(screen.getByText('Cancelar'));
    await waitFor(() => {
      expect(screen.queryByText('Excluir usuário')).toBeNull();
    });
  });

  it('removes user from list after confirmed delete', async () => {
    (userService.deleteUser as jest.Mock).mockResolvedValue(undefined);
    render(<AdminUsersScreen />);
    await screen.findByText('Ana Silva');

    fireEvent.press(screen.getByLabelText('Excluir Ana Silva'));
    await screen.findByText('Excluir usuário');

    await act(async () => {
      fireEvent.press(screen.getByText('Excluir'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Ana Silva')).toBeNull();
    });
    expect(userService.deleteUser).toHaveBeenCalledWith('1');
  });
});
