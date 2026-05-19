import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Screen = styled.View`
  flex: 1;
  background-color: ${colors.bg};
  padding: 0 24px;
`;

export const Header = styled.View`
  padding-top: 56px;
  padding-bottom: 32px;
  align-items: center;
`;

export const Info = styled.View`
  width: 100%;
  margin-top: 20px;
`;

export const RoleLabel = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.accent};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 12px;
`;

export const Avatar = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${colors.accentSubtle};
  border-width: 1px;
  border-color: ${colors.accent};
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const AvatarText = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.accent};
`;

export const Name = styled.Text`
  font-size: 26px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 4px;
`;

export const Email = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
`;

export const Actions = styled.View`
  margin-top: auto;
  padding-bottom: 32px;
`;

export const LogoutButton = styled.TouchableOpacity`
  height: 48px;
  border-radius: 4px;
  border-width: 1px;
  border-color: ${colors.accent};
  align-items: center;
  justify-content: center;
`;

export const LogoutText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${colors.accent};
  text-transform: uppercase;
  letter-spacing: 1px;
`;
