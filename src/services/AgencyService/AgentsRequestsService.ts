import { AgentRequestQueryResult } from "../../types/AgentsRequest";
import { RegistrationRequestRepository } from "../../repositories/registrationRequest/RegistrationRequest";
export class AgentsRequestsService{

    private async getRequestsByAgencyId( agencyId: number,limit: number,offset: number): Promise<AgentRequestQueryResult[]> {
    return await RegistrationRequestRepository.findAgentRequestsByAgencyId(agencyId , limit  , offset);
  }


  public async fetchRequests(agencyId:number ,limit:number, page: number ):Promise<Array<Omit<AgentRequestQueryResult, 'emailVerified'> & { emailVerified: boolean }>>{
     const offset = (page - 1) * limit; 
    const result=await this.getRequestsByAgencyId(agencyId ,limit , offset)
      return result.map(row => ({
    ...row,
    emailVerified: Boolean(row.emailVerified), // convert from 0/1 to true/false
  }));
  }


}