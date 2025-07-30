import type { NewAgencyAgent } from "../../types/AgencyAgents.js";

export interface IAgentsRepository {
  create(agentData: NewAgencyAgent): Promise<any>;  // You can specify exact return type if you want
}
