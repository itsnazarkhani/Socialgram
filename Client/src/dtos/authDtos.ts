export type RegisterDto = {
  UserName: string;
  Password: string;
};

export type LoginDto = {
  UserName: string;
  Password: string;
};

export type ResponseTokenDto = {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}
