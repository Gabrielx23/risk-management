export interface Hasher {
  hash(text: string): string;
  matches(text: string, hash: string): boolean;
}
