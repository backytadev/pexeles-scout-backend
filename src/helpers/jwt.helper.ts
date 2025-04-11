import jwt, { JwtPayload } from 'jsonwebtoken';

export const validateJWT = (token: any) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    return [true, decoded.id];
  } catch (error) {
    return [false, null];
  }
};
