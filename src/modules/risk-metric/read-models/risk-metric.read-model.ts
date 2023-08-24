import { Paginated } from '../../../shared/paginated';
import { RiskMetricPaginationQuery } from '../models/input';
import { RiskMetricView } from '../models/output';

export interface RiskMetricReadModel {
  findMany(
    criteria: RiskMetricPaginationQuery
  ): Promise<Paginated<RiskMetricView>>;
}
