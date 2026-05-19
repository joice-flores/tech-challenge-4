import styled from 'styled-components/native';
import { colors } from '../../theme/colors';

export const Screen = styled.View`
  flex: 1;
  background-color: ${colors.bg};
`;

export const CenteredScreen = styled.View`
  flex: 1;
  background-color: ${colors.bg};
  align-items: center;
  justify-content: center;
`;

export const PostCard = styled.View`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: 4px;
  padding: 14px 16px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

export const PostInfo = styled.View`
  flex: 1;
  margin-right: 12px;
`;

export const PostTitle = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 4px;
`;

export const PostMeta = styled.Text`
  font-size: 11px;
  color: ${colors.textSecondary};
  letter-spacing: 0.2px;
`;

export const Actions = styled.View`
  flex-direction: row;
  gap: 8px;
`;

export const ActionBtn = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border-width: 1px;
  border-color: ${colors.border};
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text`
  font-size: 13px;
  color: ${colors.textMuted};
  text-align: center;
  margin-top: 60px;
`;

export const ModalBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
  padding: 32px;
`;

export const ModalCard = styled.View`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.border};
  border-radius: 4px;
  padding: 24px;
  width: 100%;
`;

export const ModalTitle = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${colors.accent};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
`;

export const ModalBody = styled.Text`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 20px;
  margin-bottom: 24px;
`;

export const ModalActions = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const ModalBtn = styled.TouchableOpacity<{ variant?: 'danger' | 'ghost' }>`
  flex: 1;
  height: 40px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({ variant }: { variant?: 'danger' | 'ghost' }) =>
    variant === 'danger' ? colors.accent : colors.border};
  background-color: ${({ variant }: { variant?: 'danger' | 'ghost' }) =>
    variant === 'danger' ? colors.accent : 'transparent'};
`;

export const ModalBtnText = styled.Text<{ variant?: 'danger' | 'ghost' }>`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ variant }: { variant?: 'danger' | 'ghost' }) =>
    variant === 'danger' ? colors.bg : colors.textSecondary};
`;

export const Fab = styled.TouchableOpacity`
  position: absolute;
  bottom: 28px;
  right: 24px;
  width: 52px;
  height: 52px;
  border-radius: 4px;
  background-color: ${colors.accent};
  align-items: center;
  justify-content: center;
`;

export const FabText = styled.Text`
  font-size: 28px;
  color: ${colors.bg};
  line-height: 32px;
`;
