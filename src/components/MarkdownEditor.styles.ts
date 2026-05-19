import styled from 'styled-components/native';
import { colors } from '~/theme/colors';

export const Wrapper = styled.View`
  margin-bottom: 20px;
`;

export const Toolbar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${colors.surface};
  border-width: 1px;
  border-bottom-width: 0px;
  border-color: ${colors.border};
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 4px 6px;
  gap: 2px;
`;

export const ToolBtn = styled.TouchableOpacity`
  min-width: 32px;
  height: 28px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
`;

export const ToolLabel = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${colors.textSecondary};
  letter-spacing: 0.3px;
`;

export const ToolLabelBold = styled(ToolLabel)`
  font-weight: 900;
`;

export const ToolLabelItalic = styled(ToolLabel)`
  font-style: italic;
`;

export const ToolDivider = styled.View`
  width: 1px;
  height: 16px;
  background-color: ${colors.border};
  margin: 0 4px;
`;

export const Editor = styled.TextInput`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.border};
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding: 12px 14px;
  font-size: 14px;
  color: ${colors.textPrimary};
  min-height: 200px;
  text-align-vertical: top;
  font-family: monospace;
`;
