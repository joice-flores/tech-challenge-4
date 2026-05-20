import { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { Toast, useToast } from '~/components/Toast';
import { MarkdownEditor } from '~/components/MarkdownEditor';
import { AdminStackParamList } from '~/types/navigation';
import { fetchPosts, updatePost } from '~/services/postService';
import { colors } from '~/theme/colors';
import {
  Screen,
  FormContainer,
  Label,
  Input,
  ErrorText,
  SubmitButton,
  SubmitText,
  centeredContentStyle,
} from './EditPostScreen.styles';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'EditPost'>;
type Route = RouteProp<AdminStackParamList, 'EditPost'>;

export function EditPostScreen() {
  const navigation = useNavigation<Nav>();
  const { params } = useRoute<Route>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast, show: showToast, hide: hideToast } = useToast();

  useEffect(() => {
    fetchPosts()
      .then(posts => {
        const post = posts.find(p => p.id === params.id);
        if (post) {
          setTitle(post.title);
          setContent(post.content);
        }
      })
      .finally(() => setInitialLoading(false));
  }, [params.id]);

  async function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      setError('Preencha o título e o conteúdo.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await updatePost(params.id, { title: title.trim(), content: content.trim() });
      showToast('Post atualizado com sucesso.');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Sem permissão para editar posts.');
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
          {loading ? <ActivityIndicator color={colors.bg} /> : <SubmitText>Salvar</SubmitText>}
        </SubmitButton>

        <Toast toast={toast} onHide={hideToast} />
      </FormContainer>
    </Screen>
  );
}
