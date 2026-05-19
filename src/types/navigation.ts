export type AuthStackParamList = {
  Login: undefined;
};

export type PostsStackParamList = {
  PostList: undefined;
  PostDetail: { id: string };
};

export type AdminStackParamList = {
  AdminPosts: undefined;
  AdminPostsList: undefined;
  CreatePost: undefined;
  EditPost: { id: string };
  AdminUsers: undefined;
  CreateUser: undefined;
  EditUser: { id: string };
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type RootTabParamList = {
  PostsTab: undefined;
  AdminTab: undefined;
  ProfileTab: undefined;
};
