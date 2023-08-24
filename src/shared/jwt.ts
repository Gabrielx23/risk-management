export interface Jwt {
  sign(payload: string | object | Buffer): string;
  verify<PayloadT>(jwt: string): PayloadT | null;
}
