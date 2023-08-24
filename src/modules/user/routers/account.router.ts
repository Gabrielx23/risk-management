import { Request, Response, Router } from 'express';

import { UnauthorizedError } from '../../../shared/errors';
import { Middleware } from '../../../shared/middleware/middleware';
import { ChangePasswordAction } from '../actions/change-password.action';
import { CreateUserAction } from '../actions/create-user.action';
import { DeleteUserAction } from '../actions/delete-user.action';
import { UpdateUserAction } from '../actions/update-user.action';
import {
  ChangePasswordInput,
  CreateUserInput,
  UpdateUserInput,
} from '../models/input';
import { UserReadModel } from '../read-models/user.read-model';

type AccountRouterParams = {
  createUser: CreateUserAction;
  updateUser: UpdateUserAction;
  changePassword: ChangePasswordAction;
  deleteUser: DeleteUserAction;
  userReadModel: UserReadModel;
  authMiddleware: Middleware;
};

export const createAccountRouter = ({
  createUser,
  updateUser,
  changePassword,
  deleteUser,
  userReadModel,
  authMiddleware,
}: AccountRouterParams): Router => {
  const router = Router();
  const baseUrl = '/account';

  router.post(
    baseUrl,
    async (request: Request, response: Response): Promise<void> => {
      const input = CreateUserInput.parse(request.body);

      await createUser(input);

      response.json().status(201);
    }
  );

  router.get(
    baseUrl,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const loggedUser = await userReadModel.findById(request.user?.id);
      if (!loggedUser) {
        throw new UnauthorizedError('Missing auth identity. Log in.');
      }

      response.json(loggedUser);
    }
  );

  router.patch(
    `${baseUrl}/password`,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const input = ChangePasswordInput.parse(request.body);

      await changePassword(input, request.user);

      response.json();
    }
  );

  router.delete(
    baseUrl,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      await deleteUser(request.user?.id);

      response.json();
    }
  );

  router.put(
    baseUrl,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const input = UpdateUserInput.parse({
        ...request.body,
        role: request.user.role,
        id: request.user.id,
      });

      await updateUser(input);

      response.json();
    }
  );

  return router;
};
