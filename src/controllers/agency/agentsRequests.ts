import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../../errors/BaseError.js";
import { AgentsRequestsService } from "../../services/AgencyService/AgentsRequestsService.js";
import { RespondRequestBody } from "../../types/AgentsRequest.js";


const agentsRequestsService = new AgentsRequestsService();

export class AgentRequestController {
  static async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const agencyId = req.agencyId;

      if (!userId) throw new UnauthorizedError("User not authenticated");
      if (!agencyId) throw new ForbiddenError("Agency ID not found");

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const requests = await agentsRequestsService.fetchRequests(agencyId, limit, page);

      res.json({
        data: requests,
        pagination: { page, limit },
      });
    } catch (err) {
      next(err);
    }
  }

  static async respondToRequest(
    req: Request<{}, {}, RespondRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reviewerId = req.userId;
      if (!reviewerId) throw new UnauthorizedError("User not authenticated");

      const { requestId, status, reviewNotes , commissionRate } = req.body;
      await agentsRequestsService.respondToRequest(requestId, status, reviewerId, reviewNotes , commissionRate);

      res.json({ message: `Request ${status} successfully` });
    } catch (err) {
      next(err);
    }
  }
}
