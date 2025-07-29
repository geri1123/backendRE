import type { Agency } from '@prisma/client';
import { prisma } from '../../config/prisma.js';

export class AgencyQueries {
  static async licenseExists(license: string): Promise<boolean> {
    const agency = await prisma.agency.findFirst({
      where: { license_number: license },
      select: { id: true },
    });
    return agency !== null;
  }

  static async findByOwnerUserId(ownerUserId: number): Promise<{ id: number } | null> {
    const agency = await prisma.agency.findFirst({
      where: { owner_user_id: ownerUserId },
      select: { id: true },
    });
    return agency || null;
  }

  static async findByPublicCode(publicCode: string): Promise<Agency | null> {
    return prisma.agency.findUnique({
      where: { public_code: publicCode },
    });
  }

  static async agencyNameExist(agencyName: string): Promise<boolean> {
    const agency = await prisma.agency.findFirst({
      where: { agency_name: agencyName },
      select: { id: true },
    });
    return agency !== null;
  }
}
// import { generatePublicCode } from "../../utils/hash.js";
// import { db } from "../../config/db.js";
// import { agencies } from "../../db/schema/agencies.js";
// import { eq } from "drizzle-orm";
// import { Agency } from "../../types/database.js";
// export class AgencyQueries{
//     static async licenseExists(license: string): Promise<boolean> {
//       const result = await db
//         .select({ exists: agencies.license_number })
//         .from(agencies)
//         .where(eq(agencies.license_number, license))
//         .limit(1);
    
//       return result.length > 0;
//     }
//      static async findByOwnerUserId(ownerUserId: number): Promise<{ id: number } | null> {
//     const result = await db
//       .select({ id: agencies.id })
//       .from(agencies)
//       .where(eq(agencies.owner_user_id, ownerUserId))
//       .limit(1);

//     return result[0] || null;
//   }
    
//      static async findByPublicCode(publicCode: string): Promise<Agency | null> {
//         const result = await db
//           .select()
//           .from(agencies)
//           .where(eq(agencies.public_code, publicCode))
//           .limit(1);
        
//         return result[0] || null;
//       }
    
//       static async agencyNameExist(agencyName: string): Promise<boolean> {
//         const result = await db
//           .select({ exists: agencies.agency_name })
//           .from(agencies)
//           .where(eq(agencies.agency_name, agencyName))
//           .limit(1);
    
//         return result.length > 0;
//       }
    
// }


//  static async emailExists(email:string): Promise<boolean>{
    //   const result=await db.select({exists:agencies.agency_email})
    //  }
      
      // static async emailExists(email: string): Promise<boolean> {
      //   const [rows] = await pool.execute('SELECT 1 FROM agencies WHERE email = ?', [email]);
      //   return (rows as any[]).length > 0;
      // }