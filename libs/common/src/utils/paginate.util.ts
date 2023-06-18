export interface PaginateParams {
  page?: number;
  total?: number;
  skip?: number;
  take?: number;
  size?: number;
}

export interface Paginate {
  currentPage: number;
  size: number;
  lastPage: number;
  nextPage: number;
  prevPage: number;
}

export interface PaginateTakeSkip {
  take: number;
  skip: number;
  page: number;
}

/**
 * Pagination aggregates data, indicates the current, previous, next, last page and current size
 * @param {PaginateParams} params - The paginate parameters use for the computation
 * @return {Paginate} - Current information of a pagination
 */
export const paginateAggregation = (params: PaginateParams): Paginate => {
  const currentPage: number = Math.round(params.page);
  const size: number = Math.round(params.take);

  const lastPage: number = Math.ceil(params.total / size);
  const nextPage: number = currentPage + 1 > lastPage ? null : currentPage + 1;
  const prevPage: number = currentPage - 1 < 1 ? null : currentPage - 1;
  const countSize: number = currentPage === lastPage ? params.total - (currentPage - 1) * size : size;

  return {
    size: countSize,
    currentPage,
    nextPage,
    lastPage,
    prevPage,
  };
};

/**
 * Pagination skip, take which are represents limit and offset for the paginate data
 * @param {PaginateParams} params - The paginate parameters use for the computation
 * @return {PaginateTakeSkip} - Current limit, offer and page of a pagination
 */
export const paginateTakeSkipCalculation = (params: PaginateParams): PaginateTakeSkip => {
  const take: number = params?.size ?? 10;
  const page: number = params?.page ?? 1;
  const skip: number = (page - 1) * take;

  return { take, skip, page };
};
