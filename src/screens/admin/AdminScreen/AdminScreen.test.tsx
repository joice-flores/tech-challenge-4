import { render, screen, fireEvent } from '@testing-library/react-native';
import { AdminScreen } from './AdminScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AdminScreen', () => {
  it('renders posts and users navigation cards', () => {
    render(<AdminScreen />);
    expect(screen.getByText('Posts')).toBeTruthy();
    expect(screen.getByText('Usuários')).toBeTruthy();
  });

  it('navigates to AdminPostsList on Posts card press', () => {
    render(<AdminScreen />);
    fireEvent.press(screen.getByText('Posts'));
    expect(mockNavigate).toHaveBeenCalledWith('AdminPostsList');
  });

  it('navigates to AdminUsers on Usuários card press', () => {
    render(<AdminScreen />);
    fireEvent.press(screen.getByText('Usuários'));
    expect(mockNavigate).toHaveBeenCalledWith('AdminUsers');
  });
});
