import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { FileText, Users } from 'lucide-react-native';
import { AdminStackParamList } from '../../types/navigation';
import {
  Screen,
  NavCard,
  NavCardIcon,
  NavCardContent,
  NavCardLabel,
  NavCardDesc,
} from './AdminPostsScreen.styles';

type Nav = NativeStackNavigationProp<AdminStackParamList, 'AdminPosts'>;

export function AdminPostsScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <Screen>
      <NavCard onPress={() => navigation.navigate('AdminPostsList')} activeOpacity={0.75}>
        <NavCardIcon>
          <FileText size={28} color="#00bcd4" />
        </NavCardIcon>
        <NavCardContent>
          <NavCardLabel>Posts</NavCardLabel>
          <NavCardDesc>Criar, editar e excluir posts do blog</NavCardDesc>
        </NavCardContent>
      </NavCard>

      <NavCard onPress={() => navigation.navigate('AdminUsers')} activeOpacity={0.75}>
        <NavCardIcon>
          <Users size={28} color="#00bcd4" />
        </NavCardIcon>
        <NavCardContent>
          <NavCardLabel>Usuários</NavCardLabel>
          <NavCardDesc>Criar, editar e excluir usuários</NavCardDesc>
        </NavCardContent>
      </NavCard>
    </Screen>
  );
}
