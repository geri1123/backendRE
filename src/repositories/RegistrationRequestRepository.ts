import pool from '../config/db.js';
import { RegistrationRequest } from '../types/auth.js';

export class RegistrationRequestRepository {
  static async create(requestData: {
    user_id: number;
    id_card_number: string;
    agency_name: string;
    agency_id: number;
    status:string;
  }): Promise<number> {
    const [result] = await pool.execute(
      `INSERT INTO registration_requests 
       (user_id, request_type, id_card_number, agency_name, agency_id, status)
       VALUES (?, 'agent_license_verification', ?, ?, ?, ?)`,
      [requestData.user_id, requestData.id_card_number, requestData.agency_name, requestData.agency_id,requestData.status]
    );

    return (result as any).insertId;
  }

  static async idCardExists(idCard: string): Promise<boolean> {
    const [rows] = await pool.execute(
      'SELECT 1 FROM registration_requests WHERE id_card_number = ?',
      [idCard]
    );
    return (rows as any[]).length > 0;
  }

  static async findPendingByUserId(userId: number): Promise<RegistrationRequest | null> {
    const [rows] = await pool.execute(
      'SELECT * FROM registration_requests WHERE user_id = ? AND status = "pending"',
      [userId]
    );
    return (rows as RegistrationRequest[])[0] || null;
  }
}