export type RiskMetricId = string;
export type UserId = string;
export type ProblemId = string;
export type Likelihood = number;
export type Impact = number;

export type RiskMetric = {
  id: RiskMetricId;
  likelihood: Likelihood;
  impact: Impact;
  comment: string;
  problemId: ProblemId;
  createdAt: Date;
  createdBy: UserId;
};

export interface RiskMetricRepository {
  findById(id: RiskMetricId): Promise<RiskMetric | null>;
  create(riskMetric: RiskMetric): Promise<void>;
}
