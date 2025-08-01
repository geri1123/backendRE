import { RequestStatus } from '@prisma/client';

import { NewRegistrationRequest } from '../../types/database.js';

import { prisma } from '../../config/prisma.js';
import { AgentRequestQueryResult } from '../../types/AgentsRequest.js';

import { IRegistrationRequestRepository } from './IRegistrationRequestRepository.js';




export class RegistrationRequestRepository implements IRegistrationRequestRepository {
 
   async create(data:
     Omit<NewRegistrationRequest,'id' | 'created_at' | 'updated_at' | 'user' | 'agency' | 'reviewer'> & {
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
   async idCardExists(idCard: string): Promise<boolean> {
    const result = await prisma.registrationRequest.findFirst({
      where: {
        id_card_number: idCard,
      },
      select: { id: true },
    });

    return result !== null;
  }

   async findAgentRequestsByAgencyId(
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
    id: request.id,
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
 
   async countAgentRequestsByAgencyId(agencyId: number): Promise<number> {
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

  

   async updateStatus(
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
   async findPendingRequests(limit?: number) {
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
        created_at: 'asc', 
      },
      ...(limit && { take: limit }),
    });
  }

  
   async findByUserId(userId: number) {
    return await prisma.registrationRequest.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

    async findById(id: number) {
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

 