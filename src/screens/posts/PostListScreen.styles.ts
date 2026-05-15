import styled from 'styled-components/native';
import { colors } from '../../theme/colors';

export const Screen = styled.View`
  flex: 1;
  background-color: ${colors.bg};
`;

export const Label = styled.Text`
  font-size: 14px;
  color: ${colors.textMuted};
  text-align: center;
`;
