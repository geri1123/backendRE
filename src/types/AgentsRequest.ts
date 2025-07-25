export type AgentRequestQueryResult = {
  requestType: "agent_license_verification";
  idCardNumber: string | null;
  status: "pending" | "approved" | "rejected" | null;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: number | null;
   createdAt: Date; 
};