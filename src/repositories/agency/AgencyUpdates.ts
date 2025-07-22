
import { db } from "../../config/db.js";
import { agencies } from "../../db/schema/agencies.js";
import { eq } from "drizzle-orm";
export class AgencyUpdates
{
static async activateAgency(agencyId: number): Promise<void> {
    await db
      .update(agencies)
      .set({ status: 'active' })
      .where(eq(agencies.id, agencyId));
  }

}
