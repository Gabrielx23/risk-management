import { Request, Response, Router } from 'express';

import { Middleware } from '../../../shared/middleware/middleware';
import { AddRiskMetricAction } from '../actions/add-risk-metric.action';
import { AddRiskMetricInput, RiskMetricPaginationQuery } from '../models/input';
import { RiskMetricReadModel } from '../read-models/risk-metric.read-model';

type RiskMetricsRouterParams = {
  addRiskMetric: AddRiskMetricAction;
  riskMetricReadModel: RiskMetricReadModel;
  authMiddleware: Middleware;
};

export const createRiskMetricsRouter = ({
  addRiskMetric,
  riskMetricReadModel,
  authMiddleware,
}: RiskMetricsRouterParams): Router => {
  const router = Router();
  const baseUrl = '/problems/:problemId/risk-metrics';

  router.post(
    baseUrl,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const input = AddRiskMetricInput.parse({
        ...request.body,
        createdBy: request.user.id,
        problemId: request.params.problemId,
      });

      await addRiskMetric(input);

      response.json().status(201);
    }
  );

  router.get(
    baseUrl,
    authMiddleware,
    async (request: Request, response: Response): Promise<void> => {
      const query = RiskMetricPaginationQuery.parse({
        ...request.query,
        problemId: request.params.problemId,
      });

      const result = await riskMetricReadModel.findMany(query);

      response.json(result);
    }
  );

  return router;
};
