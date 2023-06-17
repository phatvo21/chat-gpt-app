import { isString } from 'lodash';

export const JWT_KEY = process.env.JWT_KEY ?? 'secretKey';
export const JWT_TTL = (isString(process.env.JWT_TTL) ? +process.env.JWT_TTL : process.env.JWT_TTL) ?? 900;
export const REFRESH_TOKEN_TTL =
  (isString(process.env.REFRESH_TOKEN_TTL) ? +process.env.REFRESH_TOKEN_TTL : process.env.REFRESH_TOKEN_TTL) ?? 86_400;
export const REFRESH_TOKEN_TTL_LONG_LIVED =
  (isString(process.env.REFRESH_TOKEN_TTL_LONG_LIVED)
    ? +process.env.REFRESH_TOKEN_TTL_LONG_LIVED
    : process.env.REFRESH_TOKEN_TTL_LONG_LIVED) ?? 2_592_000;
