import { Renderer } from '../../renderer';

export const rendererContentStub = '<strong>rendered!</strong>';

export const rendererStub =
  (renderedContentToBeReturned = rendererContentStub): Renderer =>
  (path: string, params: Record<string, unknown>) =>
    renderedContentToBeReturned;
