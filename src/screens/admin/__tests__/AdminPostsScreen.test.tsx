import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AdminPostsScreen } from '../AdminPostsScreen';
import * as postService from '../../../services/postService';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
  useFocusEffect: (cb: () => () => void) =>
    (jest.requireActual('react') as typeof import('react')).useEffect(cb, []),
}));

jest.mock('../../../services/postService', () => ({
  fetchPosts: jest.fn(),
  deletePost: jest.fn(),
}));

const mockPosts = [
  {
    id: '1',
    title: 'Post Alpha',
    author: 'João',
    createdAt: '2024-01-15T10:00:00Z',
    content: 'Conteúdo A',
  },
  {
    id: '2',
    title: 'Post Beta',
    author: 'Maria',
    createdAt: '2024-02-20T10:00:00Z',
    content: 'Conteúdo B',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  (postService.fetchPosts as jest.Mock).mockResolvedValue(mockPosts);
});

describe('AdminPostsScreen', () => {
  it('renders list of posts after loading', async () => {
    render(<AdminPostsScreen />);
    expect(await screen.findByText('Post Alpha')).toBeTruthy();
    expect(screen.getByText('Post Beta')).toBeTruthy();
  });

  it('shows empty state when no posts', async () => {
    (postService.fetchPosts as jest.Mock).mockResolvedValue([]);
    render(<AdminPostsScreen />);
    expect(await screen.findByText('Nenhum post encontrado.')).toBeTruthy();
  });

  it('navigates to CreatePost on FAB press', async () => {
    render(<AdminPostsScreen />);
    await screen.findByText('Post Alpha');
    fireEvent.press(screen.getByText('+'));
    expect(mockNavigate).toHaveBeenCalledWith('CreatePost');
  });

  it('navigates to EditPost for the correct post', async () => {
    render(<AdminPostsScreen />);
    await screen.findByText('Post Alpha');
    fireEvent.press(screen.getByLabelText('Editar Post Alpha'));
    expect(mockNavigate).toHaveBeenCalledWith('EditPost', { id: '1' });
  });

  it('shows confirmation modal on delete press', async () => {
    render(<AdminPostsScreen />);
    await screen.findByText('Post Alpha');
    fireEvent.press(screen.getByLabelText('Excluir Post Alpha'));
    expect(await screen.findByText('Excluir post')).toBeTruthy();
    expect(screen.getByText(/Tem certeza que deseja excluir "Post Alpha"/)).toBeTruthy();
  });

  it('closes modal on cancel press', async () => {
    render(<AdminPostsScreen />);
    await screen.findByText('Post Alpha');
    fireEvent.press(screen.getByLabelText('Excluir Post Alpha'));
    await screen.findByText('Excluir post');
    fireEvent.press(screen.getByText('Cancelar'));
    await waitFor(() => {
      expect(screen.queryByText('Excluir post')).toBeNull();
    });
  });

  it('removes post from list after confirmed delete', async () => {
    (postService.deletePost as jest.Mock).mockResolvedValue(undefined);
    render(<AdminPostsScreen />);
    await screen.findByText('Post Alpha');

    fireEvent.press(screen.getByLabelText('Excluir Post Alpha'));
    await screen.findByText('Excluir post');

    await act(async () => {
      fireEvent.press(screen.getByText('Excluir'));
    });

    await waitFor(() => {
      expect(screen.queryByText('Post Alpha')).toBeNull();
    });
    expect(postService.deletePost).toHaveBeenCalledWith('1');
  });
});
