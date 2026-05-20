import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { useAuth } from '~/contexts/AuthContext';
import { ProfileStackParamList } from '~/types/navigation';
import { updateUser } from '~/services/userService';
import { User } from '~/types/auth';
import { colors } from '~/theme/colors';
import { Toast, useToast } from '~/components/Toast';
import {
  Screen,
  centeredContentStyle,
  FormContainer,
  Label,
  Input,
  PasswordHint,
  ErrorText,
  SubmitButton,
  SubmitText,
} from './EditProfileScreen.styles';

type Nav = NativeStackNavigationProp<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError('Preencha o nome e o email.');
      return;
    }
    if (password && password.trim().length < 8) {
      setError('A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const payload: { name: string; email: string; password?: string } = {
        name: name.trim(),
        email: email.trim(),
      };
      if (password.trim()) {
        payload.password = password.trim();
      }
      const updated = await updateUser(user!.id, payload);
      const newUser: User = {
        id: user!.id,
        name: updated.name ?? name.trim(),
        email: updated.email ?? email.trim(),
        role: user!.role,
      };
      await updateProfile(newUser);
      showToast('Perfil atualizado com sucesso.');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const msg = err.response.data?.message;
          setError(typeof msg === 'string' ? msg : `Erro do servidor: ${err.response.status}`);
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

  if (!user) {
    return (
      <Screen contentContainerStyle={centeredContentStyle}>
        <ActivityIndicator size="large" color={colors.accent} />
      </Screen>
    );
  }

  return (
    <Screen>
      <FormContainer>
        <Label>Nome</Label>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Nome completo"
          placeholderTextColor="#555"
          editable={!loading}
          autoCapitalize="words"
        />

        <Label>Email</Label>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          placeholderTextColor="#555"
          editable={!loading}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Label>Nova Senha</Label>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="Deixe em branco para não alterar"
          placeholderTextColor="#555"
          editable={!loading}
          secureTextEntry
        />
        <PasswordHint>Mínimo 8 caracteres. Deixe em branco para manter a senha atual.</PasswordHint>

        {error ? <ErrorText>{error}</ErrorText> : null}

        <SubmitButton onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
          {loading ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <SubmitText>Salvar alterações</SubmitText>
          )}
        </SubmitButton>

        <Toast toast={toast} onHide={hideToast} />
      </FormContainer>
    </Screen>
  );
}
