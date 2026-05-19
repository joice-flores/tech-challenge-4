import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { CreatePostScreen } from './CreatePostScreen';
import * as postService from '~/services/postService';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
}));

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('~/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { name: 'João Silva' } }),
}));

jest.mock('~/services/postService', () => ({
  createPost: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreatePostScreen', () => {
  it('renders title, content fields and submit button', () => {
    render(<CreatePostScreen />);
    expect(screen.getByPlaceholderText('Título do post')).toBeTruthy();
    expect(screen.getByPlaceholderText('Escreva o conteúdo aqui...')).toBeTruthy();
    expect(screen.getByText('Publicar')).toBeTruthy();
  });

  it('shows validation error when fields are empty', async () => {
    render(<CreatePostScreen />);
    fireEvent.press(screen.getByText('Publicar'));
    expect(await screen.findByText('Preencha o título e o conteúdo.')).toBeTruthy();
  });

  it('shows validation error when only title is filled', async () => {
    render(<CreatePostScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Título do post'), 'Meu post');
    fireEvent.press(screen.getByText('Publicar'));
    expect(await screen.findByText('Preencha o título e o conteúdo.')).toBeTruthy();
  });

  it('calls createPost and navigates back on success', async () => {
    jest.useFakeTimers();
    (postService.createPost as unknown as jest.Mock).mockResolvedValueOnce({ id: '1' });

    render(<CreatePostScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Título do post'), 'Meu post');
    fireEvent.changeText(
      screen.getByPlaceholderText('Escreva o conteúdo aqui...'),
      'Conteúdo do post',
    );
    fireEvent.press(screen.getByText('Publicar'));

    await waitFor(() => {
      expect(postService.createPost).toHaveBeenCalledWith({
        title: 'Meu post',
        content: 'Conteúdo do post',
        author: 'João Silva',
      });
    });

    act(() => jest.advanceTimersByTime(1500));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('shows network error when no response', async () => {
    (postService.createPost as unknown as jest.Mock).mockRejectedValueOnce({ response: undefined });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<CreatePostScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Título do post'), 'Meu post');
    fireEvent.changeText(
      screen.getByPlaceholderText('Escreva o conteúdo aqui...'),
      'Conteúdo do post',
    );
    fireEvent.press(screen.getByText('Publicar'));

    expect(await screen.findByText('Não foi possível conectar ao servidor.')).toBeTruthy();
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('shows 401 permission error', async () => {
    (postService.createPost as unknown as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);

    render(<CreatePostScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Título do post'), 'Meu post');
    fireEvent.changeText(
      screen.getByPlaceholderText('Escreva o conteúdo aqui...'),
      'Conteúdo do post',
    );
    fireEvent.press(screen.getByText('Publicar'));

    expect(await screen.findByText('Sem permissão para publicar posts.')).toBeTruthy();
  });

  it('shows generic error for unexpected exceptions', async () => {
    (postService.createPost as unknown as jest.Mock).mockRejectedValueOnce(new Error('unexpected'));
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false);

    render(<CreatePostScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Título do post'), 'Meu post');
    fireEvent.changeText(
      screen.getByPlaceholderText('Escreva o conteúdo aqui...'),
      'Conteúdo do post',
    );
    fireEvent.press(screen.getByText('Publicar'));

    expect(await screen.findByText('Ocorreu um erro inesperado.')).toBeTruthy();
  });
});
