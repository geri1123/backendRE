import { AgentRequestQueryResult } from "../../types/AgentsRequest";
import { RegistrationRequestRepository } from "../../repositories/registrationRequest/RegistrationRequest";
export class AgentsRequestsService{

   private async getRequestsByAgencyId(
  agencyId: number,
  limit: number,
  offset: number
): Promise<{ data: AgentRequestQueryResult[]; total: number }> {
  return await RegistrationRequestRepository.findAgentRequestsByAgencyId(agencyId, limit, offset);
}


  public async fetchRequests(
  agencyId: number,
  limit: number,
  page: number
): Promise<{
  data: Array<Omit<AgentRequestQueryResult, 'emailVerified'> & { emailVerified: boolean }>;
  total: number;
}> {
  const offset = (page - 1) * limit;
  const { data, total } = await this.getRequestsByAgencyId(agencyId, limit, offset);

  return {
    data: data.map(row => ({
      ...row,
      emailVerified: Boolean(row.emailVerified),
    })),
    total,
  };
}


}