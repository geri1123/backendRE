import { generatePublicCode } from "../../utils/hash.js";
import { db } from "../../config/db.js";
import { agencies } from "../../db/schema/agencies.js";
import { eq } from "drizzle-orm";
export class AgencyInserts{
   static async create(agencyData: {
       agency_name: string;
       license_number: string;
       phone?: string;
       address?: string;
     }): Promise<number> {
       let publicCode: string;
   
       // Generate unique public code
       do {
         publicCode = generatePublicCode();
       } while (await this.publicCodeExists(publicCode));
   
       const [result] = await db.insert(agencies).values({
         agency_name: agencyData.agency_name,
         public_code: publicCode,
         license_number: agencyData.license_number,
         agency_email: null, 
         phone: agencyData.phone ?? null,
         address: agencyData.address ?? null,
         status: 'inactive',
         created_at: new Date(),
         updated_at: new Date(),
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