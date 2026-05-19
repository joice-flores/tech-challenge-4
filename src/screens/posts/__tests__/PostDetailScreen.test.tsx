import { render, screen } from '@testing-library/react-native';
import { PostDetailScreen } from '../PostDetailScreen';
import * as postService from '~/services/postService';

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({ params: { id: '1' } }),
}));

jest.mock('~/services/postService', () => ({
  fetchPostById: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  (postService.fetchPostById as jest.Mock).mockResolvedValue({
    id: '1',
    title: 'Post Alpha',
    content: 'Conteudo',
    author: 'Ana',
  });
});

describe('PostDetailScreen', () => {
  it('renders post content after loading', async () => {
    render(<PostDetailScreen />);
    expect(await screen.findByText('Post Alpha')).toBeTruthy();
    expect(screen.getByText('Conteudo')).toBeTruthy();
  });
});
