import { render, screen, fireEvent } from '@testing-library/react-native';
import { AdminPostsScreen } from '../AdminPostsScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AdminPostsScreen', () => {
  it('renders posts and users navigation cards', () => {
    render(<AdminPostsScreen />);
    expect(screen.getByText('Posts')).toBeTruthy();
    expect(screen.getByText('Usuários')).toBeTruthy();
  });

  it('navigates to AdminPostsList on Posts card press', () => {
    render(<AdminPostsScreen />);
    fireEvent.press(screen.getByText('Posts'));
    expect(mockNavigate).toHaveBeenCalledWith('AdminPostsList');
  });

  it('navigates to AdminUsers on Usuários card press', () => {
    render(<AdminPostsScreen />);
    fireEvent.press(screen.getByText('Usuários'));
    expect(mockNavigate).toHaveBeenCalledWith('AdminUsers');
  });
});
