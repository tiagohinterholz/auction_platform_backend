export interface DomainEvent<
  TName extends string = string,
  TPayload = unknown,
> {
  name: TName;
  occurredAt: string;
  payload: TPayload;
}
