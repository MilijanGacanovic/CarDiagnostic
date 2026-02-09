import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  const trimmedPassword = password.trim()
  
  if (trimmedPassword.length < 1) {
    return { valid: false, message: 'Password is required' }
  }
  
  if (trimmedPassword.length > 128) {
    return { valid: false, message: 'Password must not exceed 128 characters' }
  }
  
  return { valid: true }
}
