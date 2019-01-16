export type LoginModel = {
  email: string;
  password: string;
};

export type SignupModel = LoginModel & {
  firstName: string;
  lastName: string;
};
