import { Request, Response, Router } from 'express';

import { ActivateUserAction } from '../actions/activate-user.action';
import { GenerateActivationCodeAction } from '../actions/generate-activation-code.action';
import {
  ActivateUserInput,
  GenerateActivationCodeInput,
} from '../models/input';

type AccountActivationRouterParams = {
  activateUser: ActivateUserAction;
  generateActivationCode: GenerateActivationCodeAction;
};

export const createAccountActivationRouter = ({
  activateUser,
  generateActivationCode,
}: AccountActivationRouterParams): Router => {
  const router = Router();
  const baseUrl = '/account';

  router.post(
    `${baseUrl}/activate`,
    async (request: Request, response: Response): Promise<void> => {
      const input = ActivateUserInput.parse(request.body);

      await activateUser(input);

      response.json();
    }
  );

  router.post(
    `${baseUrl}/generate-activation-code`,
    async (request: Request, response: Response): Promise<void> => {
      const input = GenerateActivationCodeInput.parse(request.body);

      await generateActivationCode(input);

      response.json();
    }
  );

  return router;
};
