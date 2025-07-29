// backend/src/repositories/agencyInserts.ts
import { prisma } from '../../config/prisma.js';
import type { Prisma } from '@prisma/client';
import { generatePublicCode } from '../../utils/hash.js';

export class AgencyInserts {
  static async create(
    agencyData: Omit<Prisma.AgencyUncheckedCreateInput, 'id' | 'public_code' | 'status'>
  ): Promise<number> {
    let publicCode: string;

    // Generate unique public_code
    do {
      publicCode = generatePublicCode();
    } while (await this.publicCodeExists(publicCode));

    // Create new agency using AgencyUncheckedCreateInput
    const newAgency = await prisma.agency.create({
      data: {
        ...agencyData,
        public_code: publicCode,
        status: 'inactive',
        agency_email: agencyData.agency_email ?? null,
      },
      select: { id: true }, // we only need the id returned
    });

    return newAgency.id;
  }

  private static async publicCodeExists(publicCode: string): Promise<boolean> {
    const existing = await prisma.agency.findUnique({
      where: { public_code: publicCode },
      select: { id: true },
    });
    return existing !== null;
  }
}
// // backend/src/repositories/agencyInserts.ts
// import { prisma } from '../../config/prisma.js';
// import type { Prisma } from '@prisma/client';
// import { generatePublicCode } from '../../utils/hash.js';

// export class AgencyInserts {
 
//   static async create(
//     agencyData: Omit<Prisma.AgencyCreateInput, 'id' | 'created_at' | 'updated_at' | 'public_code' | 'status'>
//   ): Promise<number> {
//     let publicCode: string;

//     // Generate unique public_code
//     do {
//       publicCode = generatePublicCode();
//     } while (await this.publicCodeExists(publicCode));

//     // Create new agency
//     const newAgency = await prisma.agency.create({
//       data: {
//         ...agencyData,
//         public_code: publicCode,
//         status: 'inactive',
//         agency_email: agencyData.agency_email ?? null,
//       },
//       select: { id: true }, // we only need the id returned
//     });

//     return newAgency.id;
//   }

//   private static async publicCodeExists(publicCode: string): Promise<boolean> {
//     const existing = await prisma.agency.findUnique({
//       where: { public_code: publicCode },
//       select: { id: true },
//     });
//     return existing !== null;
//   }
// }

// import { generatePublicCode } from "../../utils/hash.js";
// import { db } from "../../config/db.js";
// import { agencies } from "../../db/schema/agencies.js";
// import { NewAgency } from "../../types/database.js";
// import { eq } from "drizzle-orm";
// export class AgencyInserts{
//    static async create(
//     agencyData: Omit<NewAgency, 'id' | 'created_at' | 'updated_at' | 'public_code' | 'status' > 
//   ): Promise<number> {
//     let publicCode: string;

//     do {
//       publicCode = generatePublicCode();
//     } while (await this.publicCodeExists(publicCode));

//     const [result] = await db.insert(agencies).values({
//       ...agencyData,
//       public_code: publicCode,
//       status: 'inactive',
//       agency_email: agencyData.agency_email ?? null,
     
//     });

//     return result.insertId;
//   }
//       private static async publicCodeExists(publicCode: string): Promise<boolean> {
//         const result = await db
//           .select()
//           .from(agencies)
//           .where(eq(agencies.public_code, publicCode))
//           .limit(1);
    
//         return result.length > 0;
//       }
// }