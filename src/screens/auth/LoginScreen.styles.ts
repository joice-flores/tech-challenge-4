import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 32px 24px;
  justify-content: center;
  background-color: #fff;
`;

export const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #111;
  margin-bottom: 8px;
`;

export const Subtitle = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 40px;
`;

export const Label = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
`;

export const Input = styled.TextInput`
  height: 48px;
  border-width: 1px;
  border-color: #ddd;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 15px;
  color: #111;
  background-color: #fafafa;
  margin-bottom: 16px;
`;

export const ErrorText = styled.Text`
  font-size: 13px;
  color: #e53e3e;
  margin-bottom: 16px;
`;

export const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: 50px;
  border-radius: 8px;
  background-color: ${({ disabled }) => (disabled ? '#a0aec0' : '#2563eb')};
  align-items: center;
  justify-content: center;
  margin-top: 8px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
`;
