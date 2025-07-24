import { generatePublicCode } from "../../utils/hash.js";
import { db } from "../../config/db.js";
import { agencies } from "../../db/schema/agencies.js";
import { NewAgency } from "../../types/database.js";
import { eq } from "drizzle-orm";
export class AgencyInserts{
   static async create(
    agencyData: Omit<NewAgency, 'id' | 'created_at' | 'updated_at' | 'public_code' | 'status' > 
  ): Promise<number> {
    let publicCode: string;

    do {
      publicCode = generatePublicCode();
    } while (await this.publicCodeExists(publicCode));

    const [result] = await db.insert(agencies).values({
      ...agencyData,
      public_code: publicCode,
      status: 'inactive',
      agency_email: agencyData.agency_email ?? null,
     
    });

    return result.insertId;
  }
      private static async publicCodeExists(publicCode: string): Promise<boolean> {
        const result = await db
          .select()
          .from(agencies)
          .where(eq(agencies.public_code, publicCode))
          .limit(1);
    
        return result.length > 0;
      }
}