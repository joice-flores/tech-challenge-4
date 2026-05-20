# Tech Challenge 4 — Documentação Técnica

## Sumário

1. [Visão Geral](#visão-geral)
2. [Ferramentas e Tecnologias](#ferramentas-e-tecnologias)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Configuração e Ambiente](#configuração-e-ambiente)
5. [Autenticação e Sessão](#autenticação-e-sessão)
6. [Endpoints da API](#endpoints-da-api)
7. [Navegação](#navegação)
8. [Regras de Negócio](#regras-de-negócio)
9. [Tratamento de Erros](#tratamento-de-erros)
10. [Testes](#testes)

---

## Visão Geral

Aplicação mobile desenvolvida com **React Native + Expo** para uma plataforma de blog estudantil. Permite que alunos leiam posts, professores e administradores gerenciem conteúdo, e administradores gerenciem usuários.

A aplicação consome uma API REST hospedada em `https://student-blogging-latest.onrender.com`.

---

## Ferramentas e Tecnologias

### Runtime e Framework

| Ferramenta | Versão | Uso |
|---|---|---|
| React Native | 0.81.5 | Framework mobile |
| Expo | ~54.0.33 | Plataforma de build e desenvolvimento |
| TypeScript | ~5.9.2 | Tipagem estática |
| React | 19.1.0 | Biblioteca de UI |

### Navegação

| Ferramenta | Versão | Uso |
|---|---|---|
| `@react-navigation/native` | ^7.2.4 | Núcleo de navegação |
| `@react-navigation/native-stack` | ^7.15.1 | Navegação em pilha (stack) |
| `@react-navigation/bottom-tabs` | ^7.16.1 | Abas inferiores |

### HTTP e Dados

| Ferramenta | Versão | Uso |
|---|---|---|
| `axios` | ^1.16.1 | Cliente HTTP com interceptors |
| `expo-secure-store` | ~15.0.8 | Persistência segura de token e dados do usuário |

### UI e Estilização

| Ferramenta | Versão | Uso |
|---|---|---|
| `styled-components` | ^6.4.1 | CSS-in-JS para componentes estilizados |
| `lucide-react-native` | ^1.16.0 | Ícones (Pencil, Trash2, BookOpen, Settings, User) |
| `react-native-markdown-display` | ^7.0.2 | Renderização de Markdown nos posts |
| `react-native-svg` | 15.12.1 | Suporte a SVG (dependência dos ícones) |

### Qualidade de Código

| Ferramenta | Uso |
|---|---|
| ESLint + plugins (react, react-hooks, react-native, prettier) | Análise estática |
| Prettier | Formatação automática |
| Husky + commitlint | Hooks de git e padronização de commits |

### Testes

| Ferramenta | Uso |
|---|---|
| Jest | Runner de testes |
| jest-expo | Preset Jest para projetos Expo |
| `@testing-library/react-native` | Utilitários de renderização e interação em testes |
| react-test-renderer | Renderização em ambiente de teste |

---

## Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis (Toast, MarkdownEditor)
├── contexts/
│   └── AuthContext.tsx   # Estado global de autenticação
├── navigation/
│   ├── RootNavigator.tsx # Ponto de entrada: decide Auth ou App
│   ├── AuthStack.tsx     # Stack de autenticação (Login)
│   ├── AppTabs.tsx       # Bottom tabs (Posts, Admin, Perfil)
│   ├── PostsStack.tsx    # Stack de leitura de posts
│   ├── AdminStack.tsx    # Stack de administração
│   └── ProfileStack.tsx  # Stack de perfil do usuário
├── screens/
│   ├── auth/             # LoginScreen
│   ├── posts/            # PostListScreen, PostDetailScreen
│   ├── admin/            # AdminScreen, AdminPostListScreen, AdminUsersScreen,
│   │                     # CreatePostScreen, EditPostScreen,
│   │                     # CreateUserScreen, EditUserScreen
│   └── profile/          # ProfileScreen, EditProfileScreen
├── services/
│   ├── api.ts            # Instância Axios + interceptors + token
│   ├── authService.ts    # Login e logout
│   ├── postService.ts    # CRUD de posts
│   └── userService.ts    # CRUD de usuários
├── theme/                # Cores, opções de navegação
└── types/
    ├── auth.ts           # User, UserRole
    └── navigation.ts     # Tipos de parâmetros das stacks
```

---

## Configuração e Ambiente

### Variável de Ambiente

O arquivo `.env` na raiz do projeto define a URL base da API:

```env
EXPO_PUBLIC_API_URL=https://student-blogging-latest.onrender.com
```

A variável é lida em `src/services/api.ts` via `process.env.EXPO_PUBLIC_API_URL`. O prefixo `EXPO_PUBLIC_` é obrigatório para que o Expo a exponha no bundle do cliente.

### Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento Expo
npm run android    # Inicia no Android
npm run ios        # Inicia no iOS
npm run lint       # Executa o ESLint
npm run lint:fix   # Corrige erros de lint automaticamente
npm run format     # Formata todos os arquivos com Prettier
npm test           # Executa todos os testes com Jest
npm run test:watch # Executa testes em modo watch
```

---

## Autenticação e Sessão

### Fluxo de Login

```
Usuário preenche email e senha
        ↓
POST /auth/login
        ↓
Resposta: { accessToken, user: { id, name, email, role } }
        ↓
signIn() → salva token no SecureStore
         → salva dados do usuário no SecureStore
         → configura header Authorization: Bearer <token> no Axios
         → atualiza estado global (AuthContext)
        ↓
RootNavigator detecta isAuthenticated = true
        ↓
Redireciona para AppTabs
```

### Persistência de Sessão

Ao iniciar o app, `AuthContext` lê o token e o usuário do `expo-secure-store`. Se ambos existirem, restaura a sessão sem exigir novo login.

### Fluxo de Logout

```
Usuário pressiona "Sair"
        ↓
POST /auth/logout (falhas de rede são ignoradas)
        ↓
signOut() → remove token do SecureStore
          → remove dados do usuário do SecureStore
          → remove header Authorization do Axios
          → limpa estado global
        ↓
RootNavigator redireciona para AuthStack (Login)
```

### Expiração Automática de Sessão

O interceptor de resposta do Axios monitora respostas `401 Unauthorized`. Ao detectar uma, chama o `unauthorizedHandler` registrado pelo `AuthContext`, que executa o `signOut()` automaticamente, redirecionando o usuário para a tela de login.

### Dados do Contexto de Autenticação (`useAuth()`)

| Campo | Tipo | Descrição |
|---|---|---|
| `user` | `User \| null` | Dados do usuário logado |
| `token` | `string \| null` | JWT de acesso |
| `isLoading` | `boolean` | Indica se a sessão está sendo carregada |
| `isAuthenticated` | `boolean` | `true` se há token válido |
| `isStudent` | `boolean` | `true` se `role === 'student'` |
| `isTeacher` | `boolean` | `true` se `role === 'teacher'` |
| `isAdmin` | `boolean` | `true` se `role === 'admin'` |
| `signIn` | `function` | Realiza login e persiste sessão |
| `signOut` | `function` | Encerra sessão |
| `updateProfile` | `function` | Atualiza dados do usuário no contexto e no SecureStore |

---

## Endpoints da API

Base URL: `https://student-blogging-latest.onrender.com`

Todos os endpoints (exceto `/auth/login` e `/auth/register`) exigem o header:
```
Authorization: Bearer <accessToken>
```

---

### Auth

#### `POST /auth/login`
Autentica um usuário existente.

**Body:**
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Resposta de sucesso (`200`):**
```json
{
  "accessToken": "eyJ...",
  "user": {
    "id": "abc123",
    "name": "Admin",
    "email": "admin@admin.com",
    "role": "admin"
  }
}
```

---

#### `POST /auth/logout`
Invalida a sessão no servidor. Requer autenticação.

---

#### `POST /auth/register`
Cria um usuário com role `student` por padrão (auto-cadastro). Para criar com role específica, usar `POST /users` com token de admin.

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "email@exemplo.com",
  "password": "minimo8chars"
}
```

---

### Posts

#### `GET /posts?limit=10&skip=0`
Lista posts com paginação. Requer autenticação.

**Query params:**
| Param | Tipo | Padrão | Máximo |
|---|---|---|---|
| `limit` | number | — | 100 |
| `skip` | number | 0 | — |

**Resposta:** `Post[]` ou `{ success: boolean, data: Post[] }`

---

#### `GET /posts/:id`
Retorna um post pelo ID.

**Resposta:** `Post` ou `{ success: boolean, data: Post }`

---

#### `GET /posts/search?q=termo`
Busca posts pelo termo no título ou conteúdo.

**Resposta:** `Post[]` ou `{ success: boolean, data: Post[] }`

---

#### `POST /posts`
Cria um novo post. Requer role `teacher` ou `admin`.

**Body:**
```json
{
  "title": "Título do Post",
  "content": "Conteúdo em Markdown",
  "author": "Nome do Autor"
}
```

---

#### `PUT /posts/:id`
Atualiza um post existente. Requer role `teacher` ou `admin`.

**Body:** campos opcionais `title`, `content`, `author`.

---

#### `DELETE /posts/:id`
Remove um post. Requer role `teacher` ou `admin`.

---

### Usuários

#### `GET /users`
Lista todos os usuários. Requer role `admin`.

**Resposta:** `User[]` ou `{ success: boolean, data: User[] }`

---

#### `GET /users/:id`
Retorna um usuário. Acessível pelo próprio usuário ou por `admin`.

**Resposta:** `User` ou `{ success: boolean, data: User }`

---

#### `POST /users`
Cria um usuário com role específica. Requer role `admin`.

**Body:**
```json
{
  "name": "Nome Completo",
  "email": "email@exemplo.com",
  "password": "minimo8chars",
  "role": "teacher"
}
```

**Validações da API:**
- Senha deve ter no mínimo 8 caracteres
- Email deve ser válido e único

---

#### `PUT /users/:id`
Atualiza dados de um usuário. Acessível pelo próprio usuário ou por `admin`.

**Body (admin atualizando outro usuário):**
```json
{
  "name": "Nome Atualizado",
  "role": "teacher"
}
```

**Body (usuário atualizando próprio perfil):**
```json
{
  "name": "Nome Atualizado",
  "email": "novo@email.com",
  "password": "novasenha123"
}
```

> `password` é opcional — omita para não alterar.

---

#### `DELETE /users/:id`
Remove um usuário. Requer role `admin`.

---

### Modelo de Dados

```typescript
interface Post {
  id: string;
  title: string;
  content: string;
  author?: string;
  createdAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}
```

---

## Navegação

### Estrutura de Navegação

```
RootNavigator
├── AuthStack (não autenticado)
│   └── Login
└── AppTabs (autenticado)
    ├── PostsTab → PostsStack
    │   ├── PostList
    │   └── PostDetail
    ├── AdminTab → AdminStack  [apenas teacher ou admin]
    │   ├── AdminPosts (menu)
    │   ├── AdminPostsList
    │   ├── CreatePost
    │   ├── EditPost
    │   ├── AdminUsers
    │   ├── CreateUser
    │   └── EditUser
    └── ProfileTab → ProfileStack
        ├── Profile
        └── EditProfile
```

### Regras de Visibilidade

- A aba **Admin** só aparece para usuários com role `teacher` ou `admin`
- Ao pressionar uma aba já ativa, a navegação retorna para a tela raiz da stack (`popToTop`)

---

## Regras de Negócio

### Roles

| Role | Descrição | Permissões |
|---|---|---|
| `student` | Aluno | Leitura de posts, edição do próprio perfil |
| `teacher` | Professor | Tudo do aluno + criar, editar e excluir posts |
| `admin` | Administrador | Tudo do professor + gerenciar usuários (criar, editar, excluir) |

### Posts

- **Leitura:** qualquer usuário autenticado pode ler e buscar posts
- **Criação:** apenas `teacher` ou `admin`
- **Edição:** apenas `teacher` ou `admin`
- **Exclusão:** apenas `teacher` ou `admin`
- A lista de posts atualiza automaticamente ao entrar na tela (via `useFocusEffect`)

### Usuários

- **Listar:** apenas `admin`
- **Criar com role específica:** apenas `admin` via `POST /users`
- **Editar outro usuário:** apenas `admin` (pode alterar nome e role)
- **Editar próprio perfil:** qualquer usuário autenticado (nome, email, senha)
- **Excluir:** apenas `admin`
- Senha deve ter **no mínimo 8 caracteres** ao criar ou redefinir
- A role padrão ao registrar via `/auth/register` é `student`

### Sessão

- O token JWT é armazenado com criptografia no `expo-secure-store`
- Uma resposta `401` de qualquer endpoint causa logout automático
- A sessão é restaurada ao reabrir o app se o token ainda estiver armazenado

---

## Tratamento de Erros

### Camada de Serviço

Todos os serviços usam Axios e propagam os erros para a camada de UI. O `api.ts` centraliza:

- **Interceptor de resposta**: captura `401` globalmente e aciona logout automático
- **Header Authorization**: injetado automaticamente em todas as requisições após login

### Camada de UI (telas de formulário)

O padrão adotado nas telas de criação e edição:

```typescript
try {
  // chamada à API
} catch (err) {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      // exibe a mensagem real retornada pela API
      const msg = err.response.data?.message;
      setError(typeof msg === 'string' ? msg : `Erro do servidor: ${err.response.status}`);
    } else {
      // sem resposta = problema de rede/conectividade
      setError('Não foi possível conectar ao servidor.');
    }
  } else {
    // erro JavaScript inesperado
    setError('Ocorreu um erro inesperado.');
  }
}
```

### Mensagens de erro por cenário

| Cenário | Mensagem exibida |
|---|---|
| Campo obrigatório vazio | "Preencha todos os campos." |
| Senha menor que 8 caracteres | "A senha deve ter pelo menos 8 caracteres." |
| Erro de validação da API (400) | Mensagem retornada pelo campo `message` da API |
| Sem permissão (401/403) | Mensagem da API ou logout automático |
| Sem conexão com o servidor | "Não foi possível conectar ao servidor." |
| Erro JavaScript inesperado | "Ocorreu um erro inesperado." |

### Normalização de Resposta

A API pode retornar dados em dois formatos. Os serviços normalizam ambos transparentemente:

```typescript
// Formato 1 — objeto direto
{ id: "123", name: "João", ... }

// Formato 2 — envelope com data
{ success: true, data: { id: "123", name: "João", ... } }
```

---

## Testes

### Configuração

- **Preset:** `jest-expo`
- **Aliases de módulo:** `~/` mapeia para `src/` (via `moduleNameMapper`)
- Bibliotecas nativas (lucide, styled-components, etc.) são transformadas via `transformIgnorePatterns`

### Cobertura de Testes

| Arquivo de Teste | Casos cobertos |
|---|---|
| `LoginScreen.test.tsx` | Renderização, validação de campos, login com sucesso, erros de API |
| `PostListScreen.test.tsx` | Listagem, busca, estado vazio, navegação para detalhe |
| `PostDetailScreen.test.tsx` | Carregamento, exibição do post, estado de não encontrado |
| `AdminScreen.test.tsx` | Renderização do menu de admin |
| `AdminPostsListScreen.test.tsx` | Listagem, exclusão com modal, navegação |
| `CreatePostScreen.test.tsx` | Validação, criação com sucesso, erros |
| `EditPostScreen.test.tsx` | Pré-preenchimento, atualização, erros |
| `AdminUsersScreen.test.tsx` | Listagem, FAB, editar, modal de exclusão, confirmar/cancelar exclusão |
| `CreateUserScreen.test.tsx` | Campos, validação, criação com role, erros de API |
| `EditUserScreen.test.tsx` | Pré-preenchimento, atualização com/sem senha, erros |
| `ProfileScreen.test.tsx` | Avatar, nome, role, botão editar, botão sair, logout com falha de rede |

### Convenções de Mock

```typescript
// Navegação
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useFocusEffect: (cb) => require('react').useEffect(cb, []),
  useRoute: () => ({ params: { id: '1' } }),
}));

// Serviços
jest.mock('~/services/userService', () => ({
  fetchUsers: jest.fn(),
  deleteUser: jest.fn(),
}));

// Contexto de autenticação
jest.mock('~/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));
```

### Executar os testes

```bash
npm test                        # todos os testes
npm test -- --testPathPattern=AdminUsers  # filtrar por arquivo
npm run test:watch              # modo watch
```
