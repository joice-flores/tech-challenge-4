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

export const markdownStyles = {
  body: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    backgroundColor: 'transparent',
  },
  heading1: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700' as const,
    marginTop: 24,
    marginBottom: 8,
  },
  heading2: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700' as const,
    marginTop: 20,
    marginBottom: 6,
  },
  heading3: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 16,
    marginBottom: 4,
  },
  paragraph: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 0,
    marginBottom: 12,
  },
  strong: {
    color: colors.textPrimary,
    fontWeight: '700' as const,
  },
  em: {
    color: colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  link: {
    color: colors.accent,
    textDecorationLine: 'underline' as const,
  },
  blockquote: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: colors.surface,
    color: colors.accent,
    fontFamily: 'monospace',
    paddingHorizontal: 4,
    borderRadius: 3,
    fontSize: 13,
  },
  fence: {
    backgroundColor: colors.surface,
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
  },
  code_block: {
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontFamily: 'monospace',
    fontSize: 13,
    borderRadius: 4,
    padding: 12,
    marginVertical: 8,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  list_item: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  hr: {
    backgroundColor: colors.border,
    height: 1,
    marginVertical: 16,
  },
};

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
