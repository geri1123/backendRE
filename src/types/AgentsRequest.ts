export type AgentRequestQueryResult = {
  requestType:    'agent_license_verification'|
      'agency_registration'| 
      'role_change_request' ;
  idCardNumber: string | null;
   status: 'pending' | 'approved' | 'rejected' | 'under_review' | null;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: number | null;
   createdAt: Date; 
};

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'under_review';
export type RespondRequestBody = {
  requestId: number;
  status: RequestStatus;
};