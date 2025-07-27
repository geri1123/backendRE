import { Request , Response , NextFunction } from "express"
import { AgentsRequestsService } from "../../services/AgencyService/AgentsRequestsService.js";
import { ForbiddenError, UnauthorizedError } from "../../errors/BaseError.js";
import { RespondRequestBody } from "../../types/AgentsRequest.js";

export class AgentRequestController {
  static async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
        if (!userId) throw new UnauthorizedError('User not authenticated');
       const agencyId = req.agencyId;
    if (!agencyId) {
       throw new ForbiddenError('Agency ID not found');
    }

      const getRequests=new AgentsRequestsService()
      

        const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
     const requests = await getRequests.fetchRequests(agencyId, limit , page);
      res.json({
  data: requests,
  pagination: {
    page,
    limit
  }
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
      const { requestId, status } = req.body;

      // Do your update logic here...

      res.json({ message: `Request ${status} successfully` });
    } catch (err) {
      next(err);
    }
  }
}