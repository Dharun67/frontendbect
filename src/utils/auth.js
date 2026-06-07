// Auth utility — MongoDB session-based, no localStorage
// All session state is managed via server-side sessions in MongoDB.
// The browser sends the session cookie automatically with every request.

import { getSessionUser, logoutUser } from './storage';

/**
 * Check if a user is currently logged in by querying the MongoDB session.
 * Returns true if a valid session exists, false otherwise.
 */
export const checkAuth = async () => {
  const result = await getSessionUser();
  return result && result.success === true;
};

/**
 * Logout the currently authenticated user.
 * Destroys the session in MongoDB and clears the browser cookie.
 */
export const logout = async () => {
  await logoutUser();
};

/**
 * Legacy role-specific logout wrappers.
 * All now delegate to the single session-based logout endpoint.
 */
export const logoutStudent = async () => {
  await logoutUser();
};

export const logoutFaculty = async () => {
  await logoutUser();
};

export const logoutAdmin = async () => {
  await logoutUser();
};
