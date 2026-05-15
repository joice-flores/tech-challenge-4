import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { login, parseUser } from '../../services/authService';
import {
  Container,
  Title,
  Subtitle,
  Label,
  Input,
  ErrorText,
  Button,
  ButtonText,
} from './LoginScreen.styles';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const data = await login(email.trim(), password);
      await signIn(data.accessToken, parseUser(data.user));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('E-mail ou senha inválidos.');
        } else if (err.response) {
          setError(`Erro do servidor: ${err.response.status}`);
        } else {
          setError('Não foi possível conectar ao servidor.');
        }
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Title>Bem-vindo</Title>
      <Subtitle>Faça login para continuar</Subtitle>

      <Label>E-mail</Label>
      <Input
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <Label>Senha</Label>
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        secureTextEntry
        editable={!loading}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}

      <Button onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
        {loading ? <ActivityIndicator color="#fff" /> : <ButtonText>Entrar</ButtonText>}
      </Button>
    </Container>
  );
}
