import { db } from '../../config/db.js';
import { registration_requests } from '../../db/schema/registration_requests.js';
import { eq, and } from 'drizzle-orm';
import type { RegistrationRequest } from '../../types/database.js';

export class RegistrationRequestRepository {
  static async create(requestData: {
    user_id: number;
    id_card_number: string;
    agency_name: string;
    agency_id: number;
  status: 'pending' | 'approved' | 'rejected'; 
  }): Promise<number> {
    const result = await db.insert(registration_requests).values({
      user_id: requestData.user_id,
      request_type: 'agent_license_verification',
      id_card_number: requestData.id_card_number,
      agency_name: requestData.agency_name,
      agency_id: requestData.agency_id,
      status: requestData.status,
    });

    return result[0].insertId!;
  }

  static async idCardExists(idCard: string): Promise<boolean> {
    const result = await db
      .select({ id: registration_requests.id })
      .from(registration_requests)
      .where(eq(registration_requests.id_card_number, idCard))
      .limit(1);

    return result.length > 0;
  }

  static async findPendingByUserId(userId: number): Promise<RegistrationRequest | null> {
    const result = await db
      .select()
      .from(registration_requests)
      .where(
        and(
          eq(registration_requests.user_id, userId),
          eq(registration_requests.status, 'pending')
        )
      )
      .limit(1);

    return result[0] || null;
  }
}
