export const getTotalItemsCount = (
  queryResult: { [x: string]: any }[]
): number => {
  const countRecord = queryResult[0];

  return countRecord && countRecord.count ? countRecord.count : 0;
};
