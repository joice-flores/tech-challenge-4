import { useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '~/contexts/AuthContext';
import { login, parseUser } from '~/services/authService';
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

const FILL_EMAIL_AND_PASSWORD_MESSAGE = 'Preencha e-mail e senha.';

const loginSchema = z.object({
  email: z.string().min(1, FILL_EMAIL_AND_PASSWORD_MESSAGE).email('E-mail inválido.'),
  password: z.string().min(1, FILL_EMAIL_AND_PASSWORD_MESSAGE),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState('');
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(loginSchema),
  });

  const validationMessage = useMemo(() => {
    const emailMessage = errors.email?.message;
    const passwordMessage = errors.password?.message;

    const needsFillEmailAndPassword =
      emailMessage === FILL_EMAIL_AND_PASSWORD_MESSAGE ||
      passwordMessage === FILL_EMAIL_AND_PASSWORD_MESSAGE;

    if (needsFillEmailAndPassword) {
      return FILL_EMAIL_AND_PASSWORD_MESSAGE;
    }

    return emailMessage || passwordMessage || '';
  }, [errors.email?.message, errors.password?.message]);

  const error = validationMessage || serverError;

  async function handleLogin(formData: LoginFormData) {
    const email = formData.email.trim();
    const password = formData.password;

    try {
      setServerError('');
      const data = await login(email, password);
      await signIn(data.accessToken, parseUser(data.user));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setServerError('E-mail ou senha inválidos.');
          return;
        }

        if (err.response) {
          setServerError(`Erro do servidor: ${err.response.status}`);
          return;
        }

        setServerError('Não foi possível conectar ao servidor.');
        return;
      }

      setServerError('Ocorreu um erro inesperado.');
    }
  }

  return (
    <Container>
      <Title>Bem-vindo</Title>
      <Subtitle>Faça login para continuar</Subtitle>

      <Label>E-mail</Label>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />
        )}
      />

      <Label>Senha</Label>
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="••••••••"
            secureTextEntry
            editable={!isSubmitting}
          />
        )}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}

      <Button onPress={handleSubmit(handleLogin)} disabled={isSubmitting} activeOpacity={0.8}>
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <ButtonText>Entrar</ButtonText>}
      </Button>
    </Container>
  );
}
