export interface LockService {
  acquire(key: string, ttl: number): Promise<boolean>;
  release(key: string): Promise<void>;
}
