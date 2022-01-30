import jwt from 'jsonwebtoken'

export const generateToken = async (patient: any) => {
  return await jwt.sign({...patient, password: null}, process.env.SECRET_KEY, { expiresIn: '1h' })
}