
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
  fields: Partial<NewAgency>
): Promise<void> {
  const filtered = Object.fromEntries(
    Object.entries(fields).filter(([_, val]) => val !== undefined)
  ) as Partial<NewAgency>;

  filtered.updated_at = new Date(); 
  await db.update(agencies).set(filtered).where(eq(agencies.id, agencyId));
}
}
