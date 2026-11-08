import jwt from 'jsonwebtoken';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'cobalt_skies_jwt_secret_key_2026_super_secure',
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};
