import * as fs from 'node:fs';

import { NotFoundError } from '../../shared/errors';
import { Renderer } from '../../shared/renderer';

export const createRenderer =
  (engine: {
    render: (template: string, params: Record<string, unknown>) => string;
  }): Renderer =>
  (path: string, params: Record<string, unknown> = {}): string => {
    const template = fs.readFileSync(path, 'utf8');
    if (!template) {
      throw new NotFoundError('Template does not exist.');
    }

    return engine.render(template, params);
  };
