import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { Toast, useToast } from '~/components/Toast';
import { AdminStackParamList } from '~/types/navigation';
import { fetchUserById, updateUser, UserRole } from '~/services/userService';
import { colors } from '~/theme/colors';
import {
  Screen,
  centeredContentStyle,
  FormContainer,
  Label,
  Input,
  PasswordHint,
  RoleRow,
  RoleChip,
  RoleChipText,
  ErrorText,
  SubmitButton,
  SubmitText,
} from './EditUserScreen.styles';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'EditUser'>;
type Route = RouteProp<AdminStackParamList, 'EditUser'>;

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'teacher', label: 'Professor' },
  { value: 'student', label: 'Aluno' },
];

export function EditUserScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    fetchUserById(params.id)
      .then(user => {
        setName(user.name);
        setEmail(user.email);
        if (user.role && ROLES.some(r => r.value === user.role)) {
          setRole(user.role as UserRole);
        }
      })
      .finally(() => setInitialLoading(false));
  }, [params.id]);

  async function handleSubmit() {
    if (!name.trim() || !email.trim()) {
      setError('Preencha o nome e o email.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const payload: { name: string; role: UserRole; password?: string } = {
        name: name.trim(),
        role,
      };
      if (password.trim()) {
        payload.password = password.trim();
      }
      await updateUser(params.id, payload);
      showToast('Usuário atualizado com sucesso.');
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

  if (initialLoading) {
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
        <PasswordHint>Deixe em branco para manter a senha atual.</PasswordHint>

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
          {loading ? <ActivityIndicator color={colors.bg} /> : <SubmitText>Salvar</SubmitText>}
        </SubmitButton>

        <Toast toast={toast} onHide={hideToast} />
      </FormContainer>
    </Screen>
  );
}
