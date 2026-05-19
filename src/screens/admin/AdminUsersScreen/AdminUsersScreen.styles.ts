import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Screen = styled.View`
  flex: 1;
  background-color: ${colors.bg};
`;

export const EmptyText = styled.Text`
  font-size: 13px;
  color: ${colors.textMuted};
  text-align: center;
  margin-top: 60px;
`;
