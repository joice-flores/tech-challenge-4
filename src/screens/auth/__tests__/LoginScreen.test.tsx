import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import { LoginScreen } from '../LoginScreen';
import * as authService from '../../../services/authService';
import * as AuthContext from '../../../contexts/AuthContext';

const mockSignIn = jest.fn();

jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../services/authService', () => ({
  login: jest.fn(),
  parseUser: jest.fn(),
}));

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (AuthContext.useAuth as unknown as jest.Mock).mockReturnValue({ signIn: mockSignIn });
});

describe('LoginScreen', () => {
  it('renders email, password fields and submit button', () => {
    render(<LoginScreen />);
    expect(screen.getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('••••••••')).toBeTruthy();
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('shows validation error when fields are empty', async () => {
    render(<LoginScreen />);
    fireEvent.press(screen.getByText('Entrar'));
    expect(await screen.findByText('Preencha e-mail e senha.')).toBeTruthy();
  });

  it('shows validation error when only email is filled', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('seu@email.com'), 'user@test.com');
    fireEvent.press(screen.getByText('Entrar'));
    expect(await screen.findByText('Preencha e-mail e senha.')).toBeTruthy();
  });

  it('calls login service and signIn on success', async () => {
    const fakeUser = { id: '1', name: 'João', email: 'joao@test.com' };
    const parsedUser = { id: '1', name: 'João', email: 'joao@test.com', role: 'teacher' as const };
    (authService.login as unknown as jest.Mock).mockResolvedValueOnce({
      accessToken: 'token123',
      user: fakeUser,
    });
    (authService.parseUser as unknown as jest.Mock).mockReturnValueOnce(parsedUser);

    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('seu@email.com'), 'joao@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'senha123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('joao@test.com', 'senha123');
      expect(mockSignIn).toHaveBeenCalledWith('token123', parsedUser);
    });
  });

  it('shows "E-mail ou senha inválidos" on 401', async () => {
    const axiosError = { response: { status: 401 } };
    (authService.login as unknown as jest.Mock).mockRejectedValueOnce(axiosError);
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('seu@email.com'), 'user@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'errada');
    fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('E-mail ou senha inválidos.')).toBeTruthy();
  });

  it('shows network error when no response', async () => {
    const axiosError = { response: undefined };
    (authService.login as unknown as jest.Mock).mockRejectedValueOnce(axiosError);
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('seu@email.com'), 'user@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'senha');
    fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('Não foi possível conectar ao servidor.')).toBeTruthy();
  });

  it('shows generic error for unexpected exceptions', async () => {
    (authService.login as unknown as jest.Mock).mockRejectedValueOnce(new Error('unexpected'));
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false);

    render(<LoginScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('seu@email.com'), 'user@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'senha');
    fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('Ocorreu um erro inesperado.')).toBeTruthy();
  });
});
