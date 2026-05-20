import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.bg};
`;

export const Content = styled.View`
  padding: 20px 16px 32px;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 8px;
`;

export const Meta = styled.Text`
  font-size: 12px;
  color: ${colors.textSecondary};
  letter-spacing: 0.4px;
  margin-bottom: 20px;
`;

export const Body = styled.Text`
  font-size: 14px;
  color: ${colors.textPrimary};
  line-height: 20px;
`;

export const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.bg};
`;

export const ErrorText = styled.Text`
  font-size: 13px;
  color: ${colors.accent};
`;
