import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Screen = styled.View`
  flex: 1;
  background-color: ${colors.bg};
`;

export const Centered = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.bg};
`;

export const Header = styled.View`
  padding: 16px 16px 0;
  gap: 12px;
`;

export const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${colors.textPrimary};
  letter-spacing: 0.4px;
`;

export const SearchBar = styled.View`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: 6px;
  padding: 0 12px;
  height: 44px;
  justify-content: center;
`;

export const SearchInput = styled.TextInput`
  color: ${colors.textPrimary};
  font-size: 14px;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: ${colors.accent};
`;

export const EmptyText = styled.Text`
  font-size: 13px;
  color: ${colors.textMuted};
  text-align: center;
  margin-top: 40px;
`;

export const PostCard = styled.TouchableOpacity`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: 6px;
  padding: 14px 16px;
  margin-bottom: 12px;
`;

export const PostTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 6px;
`;

export const PostMeta = styled.Text`
  font-size: 11px;
  color: ${colors.textSecondary};
  letter-spacing: 0.2px;
  margin-bottom: 8px;
`;

export const PostExcerpt = styled.Text`
  font-size: 13px;
  color: ${colors.textSecondary};
  line-height: 18px;
`;
