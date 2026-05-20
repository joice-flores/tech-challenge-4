import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { fetchPostById, Post } from '~/services/postService';
import { PostsStackParamList } from '~/types/navigation';
import { colors } from '~/theme/colors';
import {
  Container,
  Content,
  Title,
  Meta,
  Body,
  Centered,
  ErrorText,
} from './PostDetailScreen.styles';

type Route = RouteProp<PostsStackParamList, 'PostDetail'>;

export function PostDetailScreen() {
  const { params } = useRoute<Route>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const handler = setTimeout(() => {
      setLoading(true);
      setError('');

      fetchPostById(params.id)
        .then(data => {
          if (active) setPost(data);
        })
        .catch(() => {
          if (active) setError('Nao foi possivel carregar o post.');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      clearTimeout(handler);
    };
  }, [params.id]);

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator size="large" color={colors.accent} />
      </Centered>
    );
  }

  if (error) {
    return (
      <Centered>
        <ErrorText>{error}</ErrorText>
      </Centered>
    );
  }

  return (
    <Container>
      <Content>
        <Title>{post?.title ?? 'Post'}</Title>
        <Meta>{post?.author ?? 'Autor desconhecido'}</Meta>
        <Body>{post?.content ?? ''}</Body>
      </Content>
    </Container>
  );
}
