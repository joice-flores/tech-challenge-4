import { useState, useCallback } from 'react';
import { FlatList, Modal, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { AdminStackParamList } from '../../types/navigation';
import { Post, fetchPosts, deletePost } from '../../services/postService';
import { colors } from '../../theme/colors';
import { Toast, useToast } from '../../components/Toast';
import {
  Screen,
  CenteredScreen,
  PostCard,
  PostInfo,
  PostTitle,
  PostMeta,
  Actions,
  ActionBtn,
  EmptyText,
  Fab,
  FabText,
  ModalBackdrop,
  ModalCard,
  ModalTitle,
  ModalBody,
  ModalActions,
  ModalBtn,
  ModalBtnText,
} from './AdminPostsScreen.styles';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'AdminPostsList'>;

const listContentStyle = { padding: 12, paddingBottom: 100 };

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function AdminPostsListScreen() {
  const navigation = useNavigation<Nav>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchPosts()
        .then(data => {
          if (active) setPosts(data);
        })
        .catch(() => {
          if (active) setPosts([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
      return () => {
        active = false;
      };
    }, []),
  );

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    try {
      setDeleting(true);
      await deletePost(pendingDelete.id);
      setPosts(prev => prev.filter(p => p.id !== pendingDelete.id));
      setPendingDelete(null);
      showToast('Post excluído com sucesso.');
    } catch {
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <CenteredScreen>
        <ActivityIndicator size="large" color={colors.accent} />
      </CenteredScreen>
    );
  }

  return (
    <Screen>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        contentContainerStyle={listContentStyle}
        ListEmptyComponent={<EmptyText>Nenhum post encontrado.</EmptyText>}
        renderItem={({ item }) => (
          <PostCard>
            <PostInfo>
              <PostTitle numberOfLines={2}>{item.title}</PostTitle>
              <PostMeta>
                {item.author ?? ''}
                {item.author && item.createdAt ? ' · ' : ''}
                {formatDate(item.createdAt)}
              </PostMeta>
            </PostInfo>
            <Actions>
              <ActionBtn
                accessibilityRole="button"
                accessibilityLabel={`Editar ${item.title}`}
                onPress={() => navigation.navigate('EditPost', { id: item.id })}
                activeOpacity={0.7}
              >
                <Pencil size={16} color={colors.accent} />
              </ActionBtn>
              <ActionBtn
                accessibilityRole="button"
                accessibilityLabel={`Excluir ${item.title}`}
                onPress={() => setPendingDelete(item)}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color={colors.accent} />
              </ActionBtn>
            </Actions>
          </PostCard>
        )}
      />

      <Fab onPress={() => navigation.navigate('CreatePost')} activeOpacity={0.8}>
        <FabText>+</FabText>
      </Fab>

      <Toast toast={toast} onHide={hideToast} />

      <Modal
        visible={!!pendingDelete}
        transparent
        animationType="fade"
        onRequestClose={() => setPendingDelete(null)}
      >
        <ModalBackdrop>
          <ModalCard>
            <ModalTitle>Excluir post</ModalTitle>
            <ModalBody>
              {`Tem certeza que deseja excluir "${pendingDelete?.title}"? Esta ação não pode ser desfeita.`}
            </ModalBody>
            <ModalActions>
              <ModalBtn
                variant="ghost"
                onPress={() => setPendingDelete(null)}
                activeOpacity={0.7}
                disabled={deleting}
              >
                <ModalBtnText variant="ghost">Cancelar</ModalBtnText>
              </ModalBtn>
              <ModalBtn
                variant="danger"
                onPress={handleConfirmDelete}
                activeOpacity={0.8}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color={colors.bg} />
                ) : (
                  <ModalBtnText variant="danger">Excluir</ModalBtnText>
                )}
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalBackdrop>
      </Modal>
    </Screen>
  );
}
