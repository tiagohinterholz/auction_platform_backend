export interface ITokenPayload {
  sub: string;
  email: string;
  role: string;
  jti?: string;
}

export interface ITokenService {
  signAccessToken(payload: ITokenPayload): string;
  signRefreshToken(payload: ITokenPayload): string;
  verifyAccessToken(token: string): ITokenPayload;
  verifyRefreshToken(token: string): ITokenPayload;
}
