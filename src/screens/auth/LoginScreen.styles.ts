import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Container = styled.View`
  flex: 1;
  padding: 0 24px;
  justify-content: center;
  background-color: ${colors.bg};
`;

export const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${colors.accent};
  margin-bottom: 4px;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-bottom: 48px;
`;

export const Label = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  height: 48px;
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: 4px;
  padding: 0 14px;
  font-size: 15px;
  color: ${colors.textPrimary};
  background-color: ${colors.surface};
  margin-bottom: 20px;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: ${colors.accent};
  margin-bottom: 16px;
  letter-spacing: 0.2px;
`;

export const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 48px;
  border-radius: 4px;
  background-color: ${({ disabled }: { disabled?: boolean }) =>
    disabled ? colors.disabled : colors.accent};
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

export const ButtonText = styled.Text`
  color: ${colors.textPrimary};
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;
