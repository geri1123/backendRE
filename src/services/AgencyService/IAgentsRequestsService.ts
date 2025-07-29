import { AgentRequestQueryResult, RequestStatus } from "../../types/AgentsRequest.js";

export interface IAgentsRequestsService {
  fetchRequests(
    agencyId: number,
    limit: number,
    page: number
  ): Promise<{
    data: Array<Omit<AgentRequestQueryResult, 'emailVerified'> & { emailVerified: boolean }>;
    total: number;
  }>;

  respondToRequest(
    requestId: number,
    status: RequestStatus,
    reviewerId: number,
    reviewNotes?: string
  ): Promise<void>;
}
