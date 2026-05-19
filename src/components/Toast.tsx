import { useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import styled from 'styled-components/native';
import { colors } from '../theme/colors';

const Container = styled(Animated.View)`
  position: absolute;
  bottom: 32px;
  left: 20px;
  right: 20px;
  background-color: ${colors.surfaceElevated};
  border-left-width: 3px;
  border-left-color: ${colors.accent};
  border-radius: 4px;
  padding: 14px 16px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Message = styled.Text`
  flex: 1;
  font-size: 13px;
  color: ${colors.textPrimary};
  letter-spacing: 0.2px;
`;

interface ToastState {
  visible: boolean;
  message: string;
}

interface ToastProps {
  toast: ToastState;
  onHide: () => void;
}

export function Toast({ toast, onHide }: ToastProps) {
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(16));

  useEffect(() => {
    if (toast.visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 16,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => onHide());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [toast.visible, toast.message, onHide, opacity, translateY]);

  if (!toast.visible) return null;

  return (
    <Container style={{ opacity, transform: [{ translateY }] }}>
      <CheckCircle size={16} color={colors.accent} />
      <Message>{toast.message}</Message>
    </Container>
  );
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '' });

  function show(message: string) {
    setToast({ visible: true, message });
  }

  function hide() {
    setToast(prev => ({ ...prev, visible: false }));
  }

  return { toast, show, hide };
}
