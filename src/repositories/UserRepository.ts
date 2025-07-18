import pool from '../config/db';
import { User, BaseRegistration } from '../types/auth';
import { hashPassword } from '../utils/hash';

export class UserRepository {
  //login
  static async findByIdentifier(identifier: string): Promise<User | null> {
  const [rows] = await pool.execute(
    'SELECT id, username, email, password, status FROM users WHERE username = ? OR email = ?',
    [identifier, identifier]
  );
  return (rows as User[])[0] || null;
}
  static async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.execute('SELECT 1 FROM users WHERE email = ?', [email]);
    return (rows as any[]).length > 0;
  }
  
  static async usernameExists(username: string): Promise<boolean> {
    const [rows] = await pool.execute('SELECT 1 FROM users WHERE username = ?', [username]);
    return (rows as any[]).length > 0;
  }
  
  static async create(userData: BaseRegistration & {
    role: 'user' | 'agency_owner' | 'agent';
    agency_id?: number;
    status?: string;
    verification_token: string;
    verification_token_expires: Date;
  }): Promise<number> {
    const hashedPassword = await hashPassword(userData.password);
    
    const [result] = await pool.execute(
      `INSERT INTO users 
       (username, email, password, first_name, last_name, about_me, phone, website,
        role, agency_id, status, email_verified, verification_token, verification_token_expires)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false, ?, ?)`,
      [
        userData.username,
        userData.email,
        hashedPassword,
        userData.first_name,
        userData.last_name,
        userData.about_me || null,
        userData.phone || null,
        userData.website || null,
        userData.role,
        userData.agency_id || null,
        userData.status || 'active',
        userData.verification_token,
        userData.verification_token_expires
      ]
    );
    
    return (result as any).insertId;
  }
  
  static async findByVerificationToken(token: string): Promise<User | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE verification_token = ? AND verification_token_expires > NOW()',
      [token]
    );
    return (rows as User[])[0] || null;
  }
  
  static async verifyEmail(userId: number): Promise<void> {
    await pool.execute(
      `UPDATE users 
       SET email_verified = true, verification_token = NULL,
           verification_token_expires = NULL, status = 'active'
       WHERE id = ?`,
      [userId]
    );
  }
  
  static async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as User[])[0] || null;
  }
  
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return (rows as User[])[0] || null;
  }
}