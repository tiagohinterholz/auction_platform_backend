import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auth_refresh_tokens')
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  jti: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 255 })
  tokenHash: string;

  @Column('timestamp with time zone')
  expiresAt: Date;

  @Column('timestamp with time zone', { nullable: true })
  revokedAt?: Date;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
