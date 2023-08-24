import { Request, Response, Router } from 'express';

import { NotFoundError } from '../../../shared/errors';
import { Middleware } from '../../../shared/middleware/middleware';
import { Uuid } from '../../../shared/uuid';
import { AddProblemAction } from '../actions/add-problem.action';
import { DeleteProblemAction } from '../actions/delete-problem.action';
import { UpdateProblemAction } from '../actions/update-problem.action';
import {
  AddProblemInput,
  DeleteProblemInput,
  ProblemPaginationQuery,
  UpdateProblemInput,
} from '../models/input';
import { ProblemReadModel } from '../read-models/problem.read-model';

type ProblemsRouterParams = {
  addProblem: AddProblemAction;
  deleteProblem: DeleteProblemAction;
  updateProblem: UpdateProblemAction;
  problemReadModel: ProblemReadModel;
  authMiddleware: Middleware;
};

export const createProblemsRouter = ({
  addProblem,
  deleteProblem,
  updateProblem,
  problemReadModel,
  authMiddleware,
}: ProblemsRouterParams): Router => {
  const router = Router();
  const baseUrl = '/problems';

  router.post(
    baseUrl,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const input = AddProblemInput.parse({
        ...request.body,
        userId: request.user.id,
      });

      await addProblem(input);

      response.json().status(201);
    }
  );

  router.put(
    `${baseUrl}/:id`,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const input = UpdateProblemInput.parse({
        ...request.body,
        userId: request.user.id,
        problemId: request.params.id,
      });

      await updateProblem(input);

      response.json();
    }
  );

  router.delete(
    `${baseUrl}/:id`,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const input = DeleteProblemInput.parse({
        userId: request.user.id,
        problemId: request.params.id,
      });

      await deleteProblem(input);

      response.json();
    }
  );

  router.get(
    baseUrl,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const query = ProblemPaginationQuery.parse({
        ...request.query,
        userId: request.user.id,
      });

      const result = await problemReadModel.findMany(query);

      response.json(result);
    }
  );

  router.get(
    `${baseUrl}/:id`,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const result = await problemReadModel.findByIdForUser(
        Uuid.parse(request.params.id),
        request.user.id
      );

      if (!result) {
        throw new NotFoundError('Selected problem does not exist.');
      }

      response.json(result);
    }
  );

  return router;
};
