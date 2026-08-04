export const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
export const ADMIN_LOGIN_IP_MAX_ATTEMPTS = 20;

export function shouldBlockAdminLogin(
  usernameAttempts: number,
  ipAttempts: number,
) {
  return (
    usernameAttempts >= ADMIN_LOGIN_MAX_ATTEMPTS ||
    ipAttempts >= ADMIN_LOGIN_IP_MAX_ATTEMPTS
  );
}
