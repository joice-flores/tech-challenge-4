import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Screen = styled.ScrollView`
  flex: 1;
  background-color: ${colors.bg};
`;

export const centeredContentStyle = {
  flexGrow: 1,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

export const FormContainer = styled.View`
  padding: 24px 20px;
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
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: 4px;
  padding: 12px 14px;
  font-size: 15px;
  color: ${colors.textPrimary};
  margin-bottom: 20px;
`;

export const PasswordHint = styled.Text`
  font-size: 11px;
  color: ${colors.textMuted};
  margin-top: -14px;
  margin-bottom: 20px;
  letter-spacing: 0.2px;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: ${colors.accent};
  margin-bottom: 16px;
  letter-spacing: 0.2px;
`;

export const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 48px;
  border-radius: 4px;
  background-color: ${({ disabled }: { disabled?: boolean }) =>
    disabled ? colors.disabled : colors.accent};
  align-items: center;
  justify-content: center;
  margin-top: 4px;
`;

export const SubmitText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${colors.textPrimary};
  text-transform: uppercase;
  letter-spacing: 1.2px;
`;

export const RoleRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 20px;
`;

export const RoleChip = styled.TouchableOpacity<{ selected?: boolean }>`
  flex: 1;
  height: 38px;
  border-radius: 4px;
  border-width: 1px;
  border-color: ${({ selected }: { selected?: boolean }) =>
    selected ? colors.accent : colors.border};
  background-color: ${({ selected }: { selected?: boolean }) =>
    selected ? colors.accent : 'transparent'};
  align-items: center;
  justify-content: center;
`;

export const RoleChipText = styled.Text<{ selected?: boolean }>`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${({ selected }: { selected?: boolean }) => (selected ? colors.bg : colors.textSecondary)};
`;
