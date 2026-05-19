import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import axios from 'axios';
import { EditPostScreen } from './EditPostScreen';
import * as postService from '~/services/postService';

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  isAxiosError: jest.fn(),
}));

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({ params: { id: '42' } }),
}));

jest.mock('~/services/postService', () => ({
  fetchPosts: jest.fn(),
  updatePost: jest.fn(),
}));

const existingPost = {
  id: '42',
  title: 'Título original',
  content: 'Conteúdo original',
  author: 'João',
};

beforeEach(() => {
  jest.clearAllMocks();
  (postService.fetchPosts as jest.Mock).mockResolvedValue([existingPost]);
});

describe('EditPostScreen', () => {
  it('pre-fills form with existing post data', async () => {
    render(<EditPostScreen />);
    expect(await screen.findByDisplayValue('Título original')).toBeTruthy();
    expect(screen.getByDisplayValue('Conteúdo original')).toBeTruthy();
  });

  it('shows validation error when fields are empty', async () => {
    render(<EditPostScreen />);
    await screen.findByDisplayValue('Título original');
    fireEvent.changeText(screen.getByDisplayValue('Título original'), '');
    fireEvent.press(screen.getByText('Salvar'));
    expect(await screen.findByText('Preencha o título e o conteúdo.')).toBeTruthy();
  });

  it('calls updatePost and navigates back on success', async () => {
    jest.useFakeTimers();
    (postService.updatePost as jest.Mock).mockResolvedValueOnce({ id: '42' });
    render(<EditPostScreen />);
    await screen.findByDisplayValue('Título original');
    fireEvent.changeText(screen.getByDisplayValue('Título original'), 'Título editado');
    fireEvent.press(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(postService.updatePost).toHaveBeenCalledWith('42', {
        title: 'Título editado',
        content: 'Conteúdo original',
      });
    });

    act(() => jest.advanceTimersByTime(1500));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it('shows network error when no response', async () => {
    (postService.updatePost as jest.Mock).mockRejectedValueOnce({ response: undefined });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);
    render(<EditPostScreen />);
    await screen.findByDisplayValue('Título original');
    fireEvent.press(screen.getByText('Salvar'));
    expect(await screen.findByText('Não foi possível conectar ao servidor.')).toBeTruthy();
  });

  it('shows 401 permission error', async () => {
    (postService.updatePost as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } });
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(true);
    render(<EditPostScreen />);
    await screen.findByDisplayValue('Título original');
    fireEvent.press(screen.getByText('Salvar'));
    expect(await screen.findByText('Sem permissão para editar posts.')).toBeTruthy();
  });

  it('shows generic error for unexpected exceptions', async () => {
    (postService.updatePost as jest.Mock).mockRejectedValueOnce(new Error('unexpected'));
    (axios.isAxiosError as unknown as jest.Mock).mockReturnValueOnce(false);
    render(<EditPostScreen />);
    await screen.findByDisplayValue('Título original');
    fireEvent.press(screen.getByText('Salvar'));
    expect(await screen.findByText('Ocorreu um erro inesperado.')).toBeTruthy();
  });
});
