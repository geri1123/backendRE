import { generatePublicCode } from "../../utils/hash.js";
import { db } from "../../config/db.js";
import { agencies } from "../../db/schema/agencies.js";
import { eq } from "drizzle-orm";
import { Agency } from "../../types/database.js";
export class AgencyQueries{
    static async licenseExists(license: string): Promise<boolean> {
      const result = await db
        .select({ exists: agencies.license_number })
        .from(agencies)
        .where(eq(agencies.license_number, license))
        .limit(1);
    
      return result.length > 0;
    }
    //  static async emailExists(email:string): Promise<boolean>{
    //   const result=await db.select({exists:agencies.agency_email})
    //  }
      
      // static async emailExists(email: string): Promise<boolean> {
      //   const [rows] = await pool.execute('SELECT 1 FROM agencies WHERE email = ?', [email]);
      //   return (rows as any[]).length > 0;
      // }
     static async findByPublicCode(publicCode: string): Promise<Agency | null> {
        const result = await db
          .select()
          .from(agencies)
          .where(eq(agencies.public_code, publicCode))
          .limit(1);
        
        return result[0] || null;
      }
    
      static async agencyNameExist(agencyName: string): Promise<boolean> {
        const result = await db
          .select({ exists: agencies.agency_name })
          .from(agencies)
          .where(eq(agencies.agency_name, agencyName))
          .limit(1);
    
        return result.length > 0;
      }
    
}