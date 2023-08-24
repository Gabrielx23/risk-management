import { Request, Response, Router } from 'express';

import { Role } from '../../../shared/enum/role.enum';
import { NotFoundError } from '../../../shared/errors';
import { Middleware } from '../../../shared/middleware/middleware';
import { RoleMiddleware } from '../../../shared/middleware/role.middleware';
import { PaginationQuery } from '../../../shared/paginated';
import { Uuid } from '../../../shared/uuid';
import { DeleteUserAction } from '../actions/delete-user.action';
import { UpdateUserAction } from '../actions/update-user.action';
import { UpdateUserInput } from '../models/input';
import { userSortableColumns } from '../models/user';
import { UserReadModel } from '../read-models/user.read-model';

type UsersRouterParams = {
  updateUser: UpdateUserAction;
  deleteUser: DeleteUserAction;
  userReadModel: UserReadModel;
  authMiddleware: Middleware;
  roleMiddleware: RoleMiddleware;
};

export const createUsersRouter = ({
  updateUser,
  deleteUser,
  userReadModel,
  authMiddleware,
  roleMiddleware,
}: UsersRouterParams): Router => {
  const router = Router();
  const baseUrl = '/users';

  router.put(
    `${baseUrl}/:id`,
    authMiddleware,
    roleMiddleware({ allowedRoles: [Role.admin] }),
    async (request: Request, response: Response): Promise<void> => {
      const input = UpdateUserInput.parse({
        ...request.body,
        id: request.params.id,
      });

      await updateUser(input);

      response.json();
    }
  );

  router.delete(
    `${baseUrl}/:id`,
    authMiddleware,
    roleMiddleware({ allowedRoles: [Role.admin] }),
    async (request: Request, response: Response): Promise<void> => {
      const id = Uuid.parse(request.params.id);

      await deleteUser(id);

      response.json();
    }
  );

  router.get(
    `${baseUrl}/:id`,
    authMiddleware,
    roleMiddleware({ allowedRoles: [Role.admin] }),
    async (request: Request, response: Response): Promise<void> => {
      const id = Uuid.parse(request.params.id);

      const user = await userReadModel.findById(id);
      if (!user) {
        throw new NotFoundError('User does not exist.');
      }

      response.json(user);
    }
  );

  router.get(
    baseUrl,
    authMiddleware,
    roleMiddleware({ allowedRoles: [Role.admin] }),
    async (request: Request, response: Response): Promise<void> => {
      const query = PaginationQuery.parse(request.query, {
        sortableColumns: userSortableColumns,
      });

      const result = await userReadModel.findMany(query);

      response.json(result);
    }
  );

  return router;
};
