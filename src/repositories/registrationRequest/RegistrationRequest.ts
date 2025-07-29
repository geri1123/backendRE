import { PrismaClient, RequestType, RequestStatus, RequestedRole } from '@prisma/client';
import type { Prisma } from '@prisma/client';

export const prisma = new PrismaClient();


export interface AgentRequestQueryResult {
  requestType: RequestType;
  idCardNumber: string | null;
  status: RequestStatus;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  createdAt: Date;
}




export class RegistrationRequestRepository {
 
  static async create(data:
     Omit<Prisma.RegistrationRequestCreateInput,'id' | 'created_at' | 'updated_at' | 'user' | 'agency' | 'reviewer'> & {
  user_id: number;
  agency_id?: number;
}): Promise<number> {
    const result = await prisma.registrationRequest.create({
      data: {
        user_id: data.user_id,
        request_type: data.request_type,
        id_card_number: data.id_card_number,
        agency_name: data.agency_name,
        agency_id: data.agency_id,
        supporting_documents: data.supporting_documents,
        status: data.status || 'pending',
        requested_role: data.requested_role,
        license_number: data.license_number,
      },
    });
    
    return result.id;
  }
  static async idCardExists(idCard: string): Promise<boolean> {
    const result = await prisma.registrationRequest.findFirst({
      where: {
        id_card_number: idCard,
      },
      select: { id: true },
    });

    return result !== null;
  }

  static async findAgentRequestsByAgencyId(
  agencyId: number,
  limit: number,
  offset: number
): Promise<{ data: AgentRequestQueryResult[]; total: number }> {

  const whereCondition = {
    agency_id: agencyId,
    user: {
      email_verified: true,
    },
  };

  const [registrationRequests, totalCount] = await Promise.all([
    prisma.registrationRequest.findMany({
      where: whereCondition,
      include: {
        user: {
          select: {
            username: true,
            email: true,
            first_name: true,
            last_name: true,
            email_verified: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      take: limit,
      skip: offset,
    }),

    prisma.registrationRequest.count({
      where: whereCondition,
    }),
  ]);

  const formattedData: AgentRequestQueryResult[] = registrationRequests.map((request) => ({
    requestType: request.request_type,
    idCardNumber: request.id_card_number,
    status: request.status,
    username: request.user.username,
    email: request.user.email,
    firstName: request.user.first_name,
    lastName: request.user.last_name,
    emailVerified: request.user.email_verified,
    createdAt: request.created_at,
  }));

  return {
    data: formattedData,
    total: totalCount,
  };
}
 
  static async countAgentRequestsByAgencyId(agencyId: number): Promise<number> {
    return await prisma.registrationRequest.count({
      where: {
        // request_type: 'agent_license_verification',
        user: {
          email_verified: true,
          agencyAgents: {
            some: {
              agency_id: agencyId,
            },
          },
        },
      },
    });
  }

  

  static async updateStatus(
    id: number,
    status: RequestStatus,
    reviewedBy?: number,
    reviewNotes?: string
  ) {
    return await prisma.registrationRequest.update({
      where: { id },
      data: {
        status,
        reviewed_by: reviewedBy,
        review_notes: reviewNotes,
        reviewed_at: new Date(),
      },
    });
  }

  /**
   * Get all pending registration requests
   */
  static async findPendingRequests(limit?: number) {
    return await prisma.registrationRequest.findMany({
      where: {
        status: 'pending',
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc', // Oldest first for FIFO processing
      },
      ...(limit && { take: limit }),
    });
  }

  
  static async findByUserId(userId: number) {
    return await prisma.registrationRequest.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  static async findByRequestType(requestType: RequestType, limit?: number) {
    return await prisma.registrationRequest.findMany({
      where: {
        request_type: requestType,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
      ...(limit && { take: limit }),
    });
  }
   static async findById(id: number) {
    return await prisma.registrationRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
        agency: {
          select: {
            id: true,
            agency_name: true,
            license_number: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }
}

 