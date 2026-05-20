import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AdminStackParamList } from '~/types/navigation';
import { createUser, UserRole } from '~/services/userService';
import {
  Screen,
  Label,
  Input,
  RoleRow,
  RoleChip,
  RoleChipText,
  ErrorText,
  SubmitButton,
  SubmitText,
} from './CreateUserScreen.styles';
import { Toast, useToast } from '~/components/Toast';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'CreateUser'>;

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'teacher', label: 'Professor' },
  { value: 'student', label: 'Aluno' },
];

export function CreateUserScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  async function handleSubmit() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password.trim().length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await createUser({ name: name.trim(), email: email.trim(), password: password.trim(), role });
      showToast('Usuário criado com sucesso.');
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

  return (
    <Screen>
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

      <Label>Senha</Label>
      <Input
        value={password}
        onChangeText={setPassword}
        placeholder="Senha"
        placeholderTextColor="#555"
        editable={!loading}
        secureTextEntry
      />

      <Label>Perfil</Label>
      <RoleRow>
        {ROLES.map(r => (
          <RoleChip
            key={r.value}
            selected={role === r.value}
            onPress={() => setRole(r.value)}
            activeOpacity={0.7}
            disabled={loading}
          >
            <RoleChipText selected={role === r.value}>{r.label}</RoleChipText>
          </RoleChip>
        ))}
      </RoleRow>

      {error ? <ErrorText>{error}</ErrorText> : null}

      <SubmitButton onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
        {loading ? <ActivityIndicator color="#fff" /> : <SubmitText>Criar</SubmitText>}
      </SubmitButton>

      <Toast toast={toast} onHide={hideToast} />
    </Screen>
  );
}
