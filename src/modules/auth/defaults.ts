export const JWT_EXPIRATION_TIME = 60 * 5; // 5 minutes
export const REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24; // 24 hours
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: true,
};
