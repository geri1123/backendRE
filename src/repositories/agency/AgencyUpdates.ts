
import { db } from "../../config/db.js";
import { agencies } from "../../db/schema/agencies.js";
import { eq } from "drizzle-orm";
import { NewAgency } from "../../types/database.js";
export class AgencyUpdates
{
static async activateAgency(agencyId: number): Promise<void> {
    await db
      .update(agencies)
      .set({ status: 'active' })
      .where(eq(agencies.id, agencyId));
  }


static async updateAgencyFields(
  agencyId: number,
  fields: Partial<Omit<NewAgency, 'id' | 'created_at' | 'public_code' | 'updated_at'>>
): Promise<void> {
  const allowedFields = [
    'agency_name', 'logo', 'license_number', 'agency_email',
    'phone', 'address', 'website', 'status',
  ] as const;

  const filtered = Object.fromEntries(
    Object.entries(fields)
      .filter(
        ([key, val]) =>
          val !== undefined && allowedFields.includes(key as typeof allowedFields[number])
      )
  ) as Partial<NewAgency>;

  await db
    .update(agencies)
    .set({ ...filtered, updated_at: new Date() })
    .where(eq(agencies.id, agencyId));
}
}
