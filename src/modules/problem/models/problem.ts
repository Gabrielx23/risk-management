export type ProblemId = string;
export type UserId = string;
export type ProblemResult = number | null;

export const problemSortableColumns: [string, ...string[]] = [
  'problems.createdAt',
  'problems.updatedAt',
  'problems.solvedAt',
  'problems.result',
];

export type Problem = {
  id: ProblemId;
  title: string;
  description: string | null;
  result: ProblemResult;
  createdAt: Date;
  solvedAt: Date | null;
  updatedAt: Date;
  createdBy: UserId;
};

export interface ProblemRepository {
  findById(id: ProblemId): Promise<Problem | null>;
  update(problem: Problem): Promise<void>;
  delete(id: ProblemId): Promise<void>;
  create(problem: Problem): Promise<void>;
}
