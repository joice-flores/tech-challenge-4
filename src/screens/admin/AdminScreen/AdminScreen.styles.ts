import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Screen = styled.View`
  flex: 1;
  background-color: ${colors.bg};
  padding: 20px 16px;
  gap: 12px;
`;

/* Hub navigation cards */
export const NavCard = styled.TouchableOpacity`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: 4px;
  padding: 24px 20px;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const NavCardIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background-color: ${colors.bg};
  border-width: 1px;
  border-color: ${colors.border};
  align-items: center;
  justify-content: center;
`;

export const NavCardContent = styled.View`
  flex: 1;
`;

export const NavCardLabel = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 2px;
`;

export const NavCardDesc = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  line-height: 17px;
`;
