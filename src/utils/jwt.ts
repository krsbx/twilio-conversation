import jwtDecode, { JwtPayload } from 'jwt-decode';

type JWT = Omit<JwtPayload, 'exp'> & {
  id: number;
  exp: number;
  token: string;
};

export const isExpired = (token: string) => {
  const decoded = jwtDecode<JWT>(token);

  return decoded.exp < Date.now() / 1000;
};
