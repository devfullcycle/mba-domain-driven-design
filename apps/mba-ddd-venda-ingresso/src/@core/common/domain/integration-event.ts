export interface IIntegrationEvent<T = any> {
  event_name: string;
  payload: T;
  event_version: number;
  occurred_on: Date;
}
