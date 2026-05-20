# Tech Challenge 4 — Student Blogging

Aplicação mobile para uma plataforma de blog estudantil, desenvolvida com React Native + Expo. Permite que alunos leiam posts, professores gerenciem conteúdo e administradores gerenciem usuários.

## Tecnologias

- **React Native 0.81.5** + **Expo 54**
- **TypeScript**
- **React Navigation** — navegação em pilha e abas
- **Axios** — requisições HTTP com interceptors
- **Styled Components** — estilização
- **Expo SecureStore** — persistência segura de sessão
- **Jest** + **Testing Library** — testes

## Pré-requisitos

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Emulador Android/iOS ou app Expo Go no dispositivo

## Instalação

```bash
git clone https://github.com/joice-flores/tech-challenge-4.git
cd tech-challenge-4
npm install
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
EXPO_PUBLIC_API_URL=https://student-blogging-latest.onrender.com
```

## Executando

```bash
npm start       # abre o Expo Dev Tools
npm run android # Android
npm run ios     # iOS
```

## Testes e Qualidade

```bash
npm test          # executa todos os testes
npm run lint      # verifica o código com ESLint
npm run format    # formata com Prettier
```

## Funcionalidades

### Autenticação
- Login com email e senha
- Sessão persistida com criptografia (SecureStore)
- Logout automático ao receber resposta 401

### Posts
- Listagem e busca de posts
- Leitura de post com renderização Markdown
- Criação, edição e exclusão (professores e admins)

### Usuários *(admin)*
- Listagem de todos os usuários
- Criação com role específica (admin, teacher, student)
- Edição de nome e role
- Exclusão com confirmação

### Perfil
- Visualização dos dados do usuário logado
- Edição de nome, email e senha

## Papéis de Usuário

| Role | Acesso |
|---|---|
| `student` | Leitura de posts, edição do próprio perfil |
| `teacher` | Tudo do aluno + gerenciar posts |
| `admin` | Tudo do professor + gerenciar usuários |

## Estrutura de Pastas

```
src/
├── components/    # Toast, MarkdownEditor
├── contexts/      # AuthContext
├── navigation/    # Stacks e Tabs
├── screens/       # Telas organizadas por módulo
├── services/      # api, authService, postService, userService
├── theme/         # Cores e estilos de navegação
└── types/         # Tipos de autenticação e navegação
```

## Documentação Técnica

Para detalhes sobre endpoints, fluxos, regras de negócio e tratamento de erros, consulte [DOCUMENTATION.md](./DOCUMENTATION.md).
