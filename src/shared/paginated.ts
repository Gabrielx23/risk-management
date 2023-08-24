import { z } from 'zod';

export const Paginated = {
  parse: <Model>(params: {
    items: Model[];
    totalItemsCount: number;
    page: number;
    limit: number;
  }): Paginated<Model> => {
    const { items, page, limit } = params;
    const totalItemsCount = parseInt(`${params.totalItemsCount}`);

    return {
      items,
      itemsCount: items.length,
      totalItemsCount,
      page,
      totalPages:
        limit < totalItemsCount ? Math.ceil(totalItemsCount / limit) : 1,
    };
  },
};
export type Paginated<Model> = {
  items: Model[];
  itemsCount: number;
  totalItemsCount: number;
  page: number;
  totalPages: number;
};

export const PaginationQueryParseRules = (
  sortableColumns: [string, ...string[]]
): any =>
  z.object({
    page: z.number({ coerce: true }).int().positive().default(1),
    limit: z.number({ coerce: true }).int().positive().default(10),
    sortDirection: z.enum(['asc', 'desc']).default('asc'),
    sortBy: z.enum(sortableColumns).optional(),
    search: z.string().min(3).max(255).optional(),
  });

export const PaginationQuery = {
  parse: (
    data: unknown,
    options: {
      sortableColumns: [string, ...string[]];
    }
  ): PaginationQuery => {
    const { sortableColumns } = options;

    return PaginationQueryParseRules(sortableColumns).parse(data);
  },
};
export type PaginationQuery = {
  page: number;
  limit: number;
  sortDirection: 'asc' | 'desc';
  sortBy?: string;
  search?: string;
};
