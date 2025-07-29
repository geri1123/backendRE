import { prisma } from '../../config/prisma.js';
import type { NewUser } from '../../types/database.js';
import { hashPassword } from '../../utils/hash.js';

export class UserInserts {
  static async create(
    userData: Omit<NewUser, 'id' | 'created_at' | 'updated_at' | 'email_verified'> & { password: string }
  ): Promise<number> {
    const hashedPassword = await hashPassword(userData.password);

    const result = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        email_verified: false,
      },
    });

    return result.id;
  }
}
// import { db } from '../../config/db.js';
// import { users } from '../../db/schema/users.js';
// import type { NewUser } from '../../types/database.js';
// import { hashPassword } from '../../utils/hash.js';

// export class UserInserts {
//   static async create(
//     userData: Omit<NewUser, 'id' | 'created_at' | 'updated_at' | 'email_verified'> & { password: string }
//   ): Promise<number> {
//     const hashedPassword = await hashPassword(userData.password);

//     const [result] = await db.insert(users).values({
//       ...userData,
//       password: hashedPassword,
//       email_verified: 0,
//     });

//     return result.insertId;
//   }
// }