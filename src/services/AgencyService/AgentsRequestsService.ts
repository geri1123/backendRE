import { IAgentsRequestsService } from "./IAgentsRequestsService.js";
import { AgentRequestQueryResult, RequestStatus } from "../../types/AgentsRequest.js";
import { RegistrationRequestRepository } from "../../repositories/registrationRequest/RegistrationRequest.js";
import { AgentsInsert } from "../../repositories/agents/agentsInsert.js";

export class AgentsRequestsService implements IAgentsRequestsService {
  constructor(
    private registrationRequestRepo = RegistrationRequestRepository,
    private agentsInsertRepo = AgentsInsert
  ) {}

  private async getRequestsByAgencyId(
    agencyId: number,
    limit: number,
    offset: number
  ): Promise<{ data: AgentRequestQueryResult[]; total: number }> {
    return await this.registrationRequestRepo.findAgentRequestsByAgencyId(agencyId, limit, offset);
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
      data: data.map((row) => ({
        ...row,
        emailVerified: Boolean(row.emailVerified),
      })),
      total,
    };
  }

  public async respondToRequest(
    requestId: number,
    status: RequestStatus,
    reviewerId: number,
    reviewNotes?: string,
    commissionRate: number = 0  
  ): Promise<void> {
    const request = await this.registrationRequestRepo.updateStatus(
      requestId,
      status,
      reviewerId,
      reviewNotes
    );

    if (!request) {
      throw new Error(`Request with ID ${requestId} not found or could not be updated`);
    }

    if (status === "approved") {
      const fullRequest = await this.registrationRequestRepo.findById(requestId);

      if (!fullRequest?.user || !fullRequest.agency) {
        throw new Error("Missing user or agency info in approved request");
      }

      await this.agentsInsertRepo.create({
        userId: fullRequest.user.id,
        agency_id: fullRequest.agency.id,
        added_by: reviewerId,
        id_card_number: fullRequest.id_card_number,
         role_in_agency: fullRequest.requested_role || "agent", 
        status: "active",
        commission_rate: commissionRate,
        start_date: new Date(),
        end_date: null,
      });
    } else if (status === "rejected") {
      console.log(`Request ${requestId} has been rejected by reviewer ${reviewerId}`);
    }
  }
}
