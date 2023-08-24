import { Request, Response, Router } from 'express';

import { ApplyPasswordResetAction } from '../actions/apply-password-reset.action';
import { ResetPasswordAction } from '../actions/reset-password.action';
import { ApplyPasswordResetInput, ResetPasswordInput } from '../models/input';

type PasswordResetsRouterParams = {
  resetPassword: ResetPasswordAction;
  applyPasswordReset: ApplyPasswordResetAction;
};

export const createPasswordResetsRouter = ({
  resetPassword,
  applyPasswordReset,
}: PasswordResetsRouterParams): Router => {
  const router = Router();
  const baseUrl = '/account/password-reset';

  router.post(
    `${baseUrl}/request`,
    async (request: Request, response: Response): Promise<void> => {
      const input = ResetPasswordInput.parse(request.body);

      await resetPassword(input);

      response.json();
    }
  );

  router.post(
    `${baseUrl}/apply`,
    async (request: Request, response: Response): Promise<void> => {
      const input = ApplyPasswordResetInput.parse(request.body);

      await applyPasswordReset(input);

      response.json();
    }
  );

  return router;
};
