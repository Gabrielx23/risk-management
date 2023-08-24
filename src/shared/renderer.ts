export type Renderer = (
  path: string,
  params: Record<string, unknown>
) => string;
