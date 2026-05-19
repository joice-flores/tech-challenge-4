import { useMemo } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { usePosts } from '~/hooks/usePosts';
import { Post } from '~/services/postService';
import { PostsStackParamList } from '~/types/navigation';
import { colors } from '~/theme/colors';
import {
  Screen,
  Header,
  HeaderTitle,
  SearchBar,
  SearchInput,
  EmptyText,
  ErrorText,
  Centered,
  PostCard,
  PostTitle,
  PostMeta,
  PostExcerpt,
} from './PostListScreen.styles';

type Nav = NativeStackNavigationProp<PostsStackParamList, 'PostList'>;

const listContentStyle = { padding: 16, paddingBottom: 40 };

function getExcerpt(content: string, maxLength = 140) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return `${content.slice(0, maxLength).trim()}...`;
}

export function PostListScreen() {
  const navigation = useNavigation<Nav>();
  const { posts, loading, refreshing, error, query, setQuery, onRefresh } = usePosts();

  const emptyMessage = useMemo(() => {
    if (query.trim()) return 'Nenhum resultado encontrado.';
    return 'Nenhum post encontrado.';
  }, [query]);

  if (loading) {
    return (
      <Centered>
        <ActivityIndicator size="large" color={colors.accent} />
      </Centered>
    );
  }

  return (
    <Screen>
      <Header>
        <HeaderTitle>Posts</HeaderTitle>
        <SearchBar>
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar posts"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
        </SearchBar>
        {error ? <ErrorText>{error}</ErrorText> : null}
      </Header>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        contentContainerStyle={listContentStyle}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<EmptyText>{emptyMessage}</EmptyText>}
        renderItem={({ item }: { item: Post }) => (
          <PostCard
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${item.title}`}
            onPress={() => navigation.navigate('PostDetail', { id: item.id })}
            activeOpacity={0.8}
          >
            <PostTitle numberOfLines={2}>{item.title}</PostTitle>
            <PostMeta numberOfLines={1}>{item.author ?? 'Autor desconhecido'}</PostMeta>
            <PostExcerpt numberOfLines={3}>{getExcerpt(item.content)}</PostExcerpt>
          </PostCard>
        )}
      />
    </Screen>
  );
}
