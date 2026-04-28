export type RefreshTokenData = {
  id: string;
  jti: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  createdAt: Date;
};

export interface IRefreshTokenRepository {
  save(data: {
    jti: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void>;

  findByJti(jti: string): Promise<RefreshTokenData | null>;

  revokeByJti(jti: string): Promise<void>;

  revokeAllByUserId(userId: string): Promise<void>;
}
