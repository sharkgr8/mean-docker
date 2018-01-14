export class AdminUser {
  _id: string;
  name: string;
  username: string;
  password: string;
  admin: boolean;
  meta: {
    email: string,
    phone: string
  };
  created_at: string;
  updated_at: string;
}
