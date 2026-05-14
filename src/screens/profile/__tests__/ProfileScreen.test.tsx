import { render, screen } from '@testing-library/react-native';
import { ProfileScreen } from '../ProfileScreen';

describe('ProfileScreen', () => {
  it('renders correctly', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Perfil')).toBeTruthy();
  });
});
