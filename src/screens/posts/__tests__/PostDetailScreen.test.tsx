import { render, screen } from '@testing-library/react-native';
import { PostDetailScreen } from '../PostDetailScreen';

describe('PostDetailScreen', () => {
  it('renders correctly', () => {
    render(<PostDetailScreen />);
    expect(screen.getByText('Detalhe do Post')).toBeTruthy();
  });
});
