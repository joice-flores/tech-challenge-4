import { useState, useCallback } from 'react';
import { FlatList, Modal, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { AdminStackParamList } from '~/types/navigation';
import { User, fetchUsers, deleteUser } from '~/services/userService';
import { colors } from '~/theme/colors';
import { Toast, useToast } from '~/components/Toast';
import {
  Screen,
  CenteredScreen,
  UserCard,
  UserInfo,
  UserName,
  UserEmail,
  UserRole,
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
} from './AdminUsersScreen.styles';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'AdminUsers'>;

const listContentStyle = { padding: 12, paddingBottom: 100 };

export function AdminUsersScreen() {
  const navigation = useNavigation<Nav>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast, show: showToast, hide: hideToast } = useToast();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      fetchUsers()
        .then(data => {
          if (active) setUsers(data);
        })
        .catch(() => {
          if (active) setUsers([]);
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
      await deleteUser(pendingDelete.id);
      setUsers(prev => prev.filter(u => u.id !== pendingDelete.id));
      setPendingDelete(null);
      showToast('Usuário excluído com sucesso.');
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
        data={users}
        keyExtractor={item => item.id}
        contentContainerStyle={listContentStyle}
        ListEmptyComponent={<EmptyText>Nenhum usuário encontrado.</EmptyText>}
        renderItem={({ item }) => (
          <UserCard>
            <UserInfo>
              <UserName numberOfLines={1}>{item.name}</UserName>
              <UserEmail numberOfLines={1}>{item.email}</UserEmail>
              {item.role ? <UserRole>{item.role}</UserRole> : null}
            </UserInfo>
            <Actions>
              <ActionBtn
                accessibilityRole="button"
                accessibilityLabel={`Editar ${item.name}`}
                onPress={() => navigation.navigate('EditUser', { id: item.id })}
                activeOpacity={0.7}
              >
                <Pencil size={16} color={colors.accent} />
              </ActionBtn>
              <ActionBtn
                accessibilityRole="button"
                accessibilityLabel={`Excluir ${item.name}`}
                onPress={() => setPendingDelete(item)}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color={colors.accent} />
              </ActionBtn>
            </Actions>
          </UserCard>
        )}
      />

      <Fab onPress={() => navigation.navigate('CreateUser')} activeOpacity={0.8}>
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
            <ModalTitle>Excluir usuário</ModalTitle>
            <ModalBody>
              {`Tem certeza que deseja excluir "${pendingDelete?.name}"? Esta ação não pode ser desfeita.`}
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
