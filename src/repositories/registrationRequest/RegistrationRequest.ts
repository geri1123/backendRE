import { db } from '../../config/db.js';
import { registration_requests } from '../../db/schema/registration_requests.js';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { users } from '../../db/schema/users.js';
import { NewRegistrationRequest } from '../../types/database.js';
import { AgentRequestQueryResult } from '../../types/AgentsRequest.js';
export class RegistrationRequestRepository {

  static async create(
    data: Omit<NewRegistrationRequest, 'id'  | 'created_at' | 'updated_at'>
  ): Promise<number> {
    // status, created_at, and updated_at handled by schema
    const [result] = await db.insert(registration_requests).values(data);

    return result.insertId;
  }

  static async idCardExists(idCard: string): Promise<boolean> {
    const result = await db
      .select({ id: registration_requests.id })
      .from(registration_requests)
      .where(eq(registration_requests.id_card_number, idCard))
      .limit(1);

    return result.length > 0;
  }
 static async findAgentRequestsByAgencyId(agencyId: number , limit:number , offset:number):Promise<AgentRequestQueryResult[]> {
    return db
      .select({
        
        requestType: registration_requests.request_type,
        idCardNumber: registration_requests.id_card_number,
        status: registration_requests.status,
        username: users.username,
        email: users.email,
        firstName: users.first_name,
        lastName: users.last_name,
       emailVerified: users.email_verified, 
       createdAt:registration_requests.created_at,
      })
      .from(registration_requests)
      .innerJoin(users, eq(registration_requests.user_id, users.id))
      .where(
        and(
          eq(users.agency_id, agencyId),
          eq(registration_requests.request_type, 'agent_license_verification'),
          eq(users.email_verified , 1)
        )
      )  
      .limit(limit)
    .offset(offset);;
  }

  
static async countAgentRequestsByAgencyId(agencyId: number): Promise<number> {
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(registration_requests)
    .innerJoin(users, eq(registration_requests.user_id, users.id))
    .where(
      and(
        eq(users.agency_id, agencyId),
        eq(registration_requests.request_type, 'agent_license_verification'),
        eq(users.email_verified, 1)
      )
    );

  return result[0]?.count ?? 0;
}
}
