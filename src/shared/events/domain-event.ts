export interface DomainEvent<
  TName extends string = string,
  TPayload = unknown,
> {
  name: TName;
  occurredAt: string; // ISO 8601 UTC
  payload: TPayload;
}
