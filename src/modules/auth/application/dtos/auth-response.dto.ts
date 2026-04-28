export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;

  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class RefreshResponseDto {
  accessToken: string;
  refreshToken: string;
}
