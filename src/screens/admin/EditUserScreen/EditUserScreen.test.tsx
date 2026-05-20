import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { EditUserScreen } from './EditUserScreen';
import * as userService from '~/services/userService';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
}));

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { id: '1' } }),
}));

jest.mock('~/services/userService', () => ({
  fetchUserById: jest.fn(),
  updateUser: jest.fn(),
}));

const mockUser = { id: '1', name: 'João Silva', email: 'joao@test.com', role: 'teacher' };

beforeEach(() => {
  jest.clearAllMocks();
  (userService.fetchUserById as jest.Mock).mockResolvedValue(mockUser);
});

describe('EditUserScreen', () => {
  it('renders with pre-filled name and email', async () => {
    render(<EditUserScreen />);
    expect(await screen.findByDisplayValue('João Silva')).toBeTruthy();
    expect(screen.getByDisplayValue('joao@test.com')).toBeTruthy();
  });

  it('shows validation error when name or email is cleared', async () => {
    render(<EditUserScreen />);
    await screen.findByDisplayValue('João Silva');
    fireEvent.changeText(screen.getByDisplayValue('João Silva'), '');
    fireEvent.press(screen.getByText('Salvar'));
    expect(await screen.findByText('Preencha o nome e o email.')).toBeTruthy();
  });

  it('calls updateUser without password when password field is empty', async () => {
    jest.useFakeTimers();
    (userService.updateUser as unknown as jest.Mock).mockResolvedValueOnce(mockUser);

    render(<EditUserScreen />);
    await screen.findByDisplayValue('João Silva');
    fireEvent.press(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(userService.updateUser).toHaveBeenCalledWith('1', {
        name: 'João Silva',
        role: 'teacher',
      });
    });

    act(() => jest.advanceTimersByTime(1500));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('calls updateUser with password when provided', async () => {
    jest.useFakeTimers();
    (userService.updateUser as unknown as jest.Mock).mockResolvedValueOnce(mockUser);

    render(<EditUserScreen />);
    await screen.findByDisplayValue('João Silva');
    fireEvent.changeText(
      screen.getByPlaceholderText('Deixe em branco para não alterar'),
      'novasenha',
    );
    fireEvent.press(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(userService.updateUser).toHaveBeenCalledWith('1', {
        name: 'João Silva',
        role: 'teacher',
        password: 'novasenha',
      });
    });

    act(() => jest.advanceTimersByTime(1500));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('shows network error when no response', async () => {
    (userService.updateUser as unknown as jest.Mock).mockRejectedValueOnce({
      response: undefined,
    });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<EditUserScreen />);
    await screen.findByDisplayValue('João Silva');
    fireEvent.press(screen.getByText('Salvar'));

    expect(await screen.findByText('Não foi possível conectar ao servidor.')).toBeTruthy();
  });

  it('shows 401 permission error', async () => {
    (userService.updateUser as unknown as jest.Mock).mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Sem permissão para editar usuários.' } },
    });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<EditUserScreen />);
    await screen.findByDisplayValue('João Silva');
    fireEvent.press(screen.getByText('Salvar'));

    expect(await screen.findByText('Sem permissão para editar usuários.')).toBeTruthy();
  });

  it('shows generic error for unexpected exceptions', async () => {
    (userService.updateUser as unknown as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false);

    render(<EditUserScreen />);
    await screen.findByDisplayValue('João Silva');
    fireEvent.press(screen.getByText('Salvar'));

    expect(await screen.findByText('Ocorreu um erro inesperado.')).toBeTruthy();
  });
});
