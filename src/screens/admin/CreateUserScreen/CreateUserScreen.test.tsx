import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { CreateUserScreen } from './CreateUserScreen';
import * as userService from '~/services/userService';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
}));

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('~/services/userService', () => ({
  createUser: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreateUserScreen', () => {
  it('renders name, email, password fields and submit button', () => {
    render(<CreateUserScreen />);
    expect(screen.getByPlaceholderText('Nome completo')).toBeTruthy();
    expect(screen.getByPlaceholderText('email@exemplo.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Senha')).toBeTruthy();
    expect(screen.getByText('Criar')).toBeTruthy();
  });

  it('shows validation error when fields are empty', async () => {
    render(<CreateUserScreen />);
    fireEvent.press(screen.getByText('Criar'));
    expect(await screen.findByText('Preencha todos os campos.')).toBeTruthy();
  });

  it('shows validation error when only name is filled', async () => {
    render(<CreateUserScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'João');
    fireEvent.press(screen.getByText('Criar'));
    expect(await screen.findByText('Preencha todos os campos.')).toBeTruthy();
  });

  it('calls createUser and navigates back on success', async () => {
    jest.useFakeTimers();
    (userService.createUser as unknown as jest.Mock).mockResolvedValueOnce({ id: '1' });

    render(<CreateUserScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'João Silva');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'joao@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'senha123');
    fireEvent.press(screen.getByText('Criar'));

    await waitFor(() => {
      expect(userService.createUser).toHaveBeenCalledWith({
        name: 'João Silva',
        email: 'joao@test.com',
        password: 'senha123',
        role: 'student',
      });
    });

    act(() => jest.advanceTimersByTime(1500));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('shows network error when no response', async () => {
    (userService.createUser as unknown as jest.Mock).mockRejectedValueOnce({
      response: undefined,
    });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<CreateUserScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'João');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'joao@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'senha123');
    fireEvent.press(screen.getByText('Criar'));

    expect(await screen.findByText('Não foi possível conectar ao servidor.')).toBeTruthy();
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('shows 401 permission error', async () => {
    (userService.createUser as unknown as jest.Mock).mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Sem permissão para criar usuários.' } },
    });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<CreateUserScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'João');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'joao@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'senha123');
    fireEvent.press(screen.getByText('Criar'));

    expect(await screen.findByText('Sem permissão para criar usuários.')).toBeTruthy();
  });

  it('shows generic error for unexpected exceptions', async () => {
    (userService.createUser as unknown as jest.Mock).mockRejectedValueOnce(new Error('unexpected'));
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false);

    render(<CreateUserScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Nome completo'), 'João');
    fireEvent.changeText(screen.getByPlaceholderText('email@exemplo.com'), 'joao@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Senha'), 'senha123');
    fireEvent.press(screen.getByText('Criar'));

    expect(await screen.findByText('Ocorreu um erro inesperado.')).toBeTruthy();
  });
});
