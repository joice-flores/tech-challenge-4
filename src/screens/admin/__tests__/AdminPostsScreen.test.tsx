import { render, screen } from '@testing-library/react-native';
import { AdminPostsScreen } from '../AdminPostsScreen';

describe('AdminPostsScreen', () => {
  it('renders correctly', () => {
    render(<AdminPostsScreen />);
    expect(screen.getByText('Admin – Posts')).toBeTruthy();
  });
});
