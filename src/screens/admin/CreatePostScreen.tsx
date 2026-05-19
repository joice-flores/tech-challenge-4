import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Toast, useToast } from '../../components/Toast';
import { MarkdownEditor } from '../../components/MarkdownEditor';
import { AdminStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { createPost } from '../../services/postService';
import {
  Screen,
  Label,
  Input,
  ErrorText,
  SubmitButton,
  SubmitText,
} from './CreatePostScreen.styles';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'CreatePost'>;

export function CreatePostScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      setError('Preencha o título e o conteúdo.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await createPost({ title: title.trim(), content: content.trim(), author: user?.name ?? '' });
      showToast('Post criado com sucesso.');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Sem permissão para publicar posts.');
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
    <Screen>
      <Label>Título</Label>
      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="Título do post"
        placeholderTextColor="#555"
        editable={!loading}
        maxLength={120}
      />

      <Label>Conteúdo</Label>
      <MarkdownEditor
        value={content}
        onChange={setContent}
        placeholder="Escreva o conteúdo aqui..."
        editable={!loading}
      />

      {error ? <ErrorText>{error}</ErrorText> : null}

      <SubmitButton onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
        {loading ? <ActivityIndicator color="#fff" /> : <SubmitText>Publicar</SubmitText>}
      </SubmitButton>

      <Toast toast={toast} onHide={hideToast} />
    </Screen>
  );
}
