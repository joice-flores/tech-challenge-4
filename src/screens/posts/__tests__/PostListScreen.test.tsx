import { render, screen, fireEvent } from '@testing-library/react-native';
import { PostListScreen } from '../PostListScreen';
import * as postService from '~/services/postService';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('~/services/postService', () => ({
  fetchPosts: jest.fn(),
  searchPosts: jest.fn(),
}));

const mockPosts = [
  {
    id: '1',
    title: 'Post Alpha',
    author: 'Ana',
    content: 'Conteudo do post',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  (postService.fetchPosts as jest.Mock).mockResolvedValue(mockPosts);
});

describe('PostListScreen', () => {
  it('renders posts after loading', async () => {
    render(<PostListScreen />);
    expect(await screen.findByText('Post Alpha')).toBeTruthy();
  });

  it('shows empty state when no posts', async () => {
    (postService.fetchPosts as jest.Mock).mockResolvedValue([]);
    render(<PostListScreen />);
    expect(await screen.findByText('Nenhum post encontrado.')).toBeTruthy();
  });

  it('navigates to detail on card press', async () => {
    render(<PostListScreen />);
    await screen.findByText('Post Alpha');
    fireEvent.press(screen.getByLabelText('Abrir Post Alpha'));
    expect(mockNavigate).toHaveBeenCalledWith('PostDetail', { id: '1' });
  });
});
