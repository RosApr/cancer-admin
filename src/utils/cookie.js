import Cookies from 'js-cookie';

const TokenKey = 'token';

export const getTokenFromCookie = () => {
  return Cookies.get(TokenKey);
};

export const setTokenToCookie = token => {
  return Cookies.set(TokenKey, token);
};

export const removeTokenFromCookie = () => {
  return Cookies.remove(TokenKey);
};

const RoleKey = 'role';

export const getUserRoleFromCookie = () => {
  return Cookies.get(RoleKey);
};

export const setUserRoleToCookie = token => {
  return Cookies.set(RoleKey, token);
};

export const removeUserRoleFromCookie = () => {
  return Cookies.remove(RoleKey);
};
