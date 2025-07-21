import pool from '../config/db.js';
import { User, BaseRegistration } from '../types/auth.js';
import { hashPassword } from '../utils/hash.js';

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
      'SELECT id, role, email, first_name, agency_id  FROM users WHERE verification_token = ? AND verification_token_expires > NOW()',
      [token]
    );
    return (rows as User[])[0] || null;
  }
  
  static async verifyEmail(userId: number, emailVerified: number, statusToUpdate: string): Promise<void> {
  await pool.execute(
    `UPDATE users 
     SET email_verified = ?, status = ?, 
         verification_token = NULL, verification_token_expires = NULL 
     WHERE id = ?`,
    [emailVerified, statusToUpdate, userId] 
  );
}
static async regenerateVerificationToken(userId: number, token: string, expires: Date): Promise<string> {
  await pool.execute(
    'UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?',
    [token, expires, userId]
  );
  return token;
}
 static async findById(id: number): Promise<User | null> {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
  const users = rows as User[];
  if (users.length === 0) return null;
  return users[0];
} 

  
  static async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return (rows as User[])[0] || null;
  }
 static async getUsernameById(userId: number): Promise<string | null> {
    const [rows] = await pool.execute('SELECT username FROM users WHERE id = ?', [userId]);
    return (rows as any[])[0]?.username || null;
  }

  static async updateUsername(userId: number, newUsername: string): Promise<void> {
    await pool.execute(
      'UPDATE users SET username = ?, updated_at = NOW() WHERE id = ?',
      [newUsername, userId]
    );
  }
  static async getUserPasswordById( userId: number): Promise<string | null> {
  const [rows] = await pool.execute("SELECT password FROM users WHERE id = ?", [userId]);
  if ((rows as any[]).length === 0) {
    return null;
  }
  return (rows as any)[0].password;
}
static async updatePassword(userId: number, hashedPassword: string): Promise<void> {
  await pool.execute("UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?", [hashedPassword, userId]);
}
static async updateProfileImg(userId: number, profileImg: string): Promise<void> {
  await pool.execute("UPDATE `users` SET profile_img = ?,updated_at = NOW()  WHERE id = ?", [profileImg, userId]);
}
static async updateAboutMe(userId: number, aboutMe: string): Promise<void> {
  await pool.execute("UPDATE `users` SET about_me = ?,updated_at = NOW()  WHERE id = ?", [aboutMe, userId]);
}
static async updatePhone(userId: number, phone: string): Promise<void> {
  await pool.execute("UPDATE `users` SET phone = ?,updated_at = NOW()  WHERE id = ?", [phone, userId]);
}
static async updateFnmLnm(userId:number , firstName:string ,lastName:string  ):Promise<void>{
   await pool.execute("UPDATE `users` SET first_name = ? , last_name=?,updated_at = NOW()  WHERE id = ?", [firstName , lastName, userId]);
}
}