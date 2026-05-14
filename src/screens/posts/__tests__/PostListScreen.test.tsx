import { render, screen } from '@testing-library/react-native';
import { PostListScreen } from '../PostListScreen';

describe('PostListScreen', () => {
  it('renders correctly', () => {
    render(<PostListScreen />);
    expect(screen.getByText('Lista de Posts')).toBeTruthy();
  });
});
