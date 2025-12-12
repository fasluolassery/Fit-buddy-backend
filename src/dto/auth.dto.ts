export interface SignUp {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "user" | "trainer" | "admin";
}

export interface SignIn {
  email: string;
  password: string;
}
