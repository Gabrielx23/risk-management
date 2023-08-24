export type Risk = {
  likelihood: number;
  impact: number;
  calculated: number;
};

export const Risk = (
  metric: Pick<Risk, 'likelihood' | 'impact'> | null
): Risk => {
  const likelihood = metric?.likelihood ?? 0;
  const impact = metric?.impact ?? 0;

  return {
    likelihood,
    impact,
    calculated: likelihood * impact,
  };
};
