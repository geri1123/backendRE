import { Request , Response , NextFunction } from "express"
import { AgentsRequestsService } from "../../services/AgencyService/AgentsRequestsService";


export class AgentRequestController {
  static async getRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const getRequests=new AgentsRequestsService()
      const agencyId = req.agencyId!;

        const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
     const requests = await getRequests.fetchRequests(agencyId , limit , page);
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

  static async respondToRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { requestId, status } = req.body;
      const reviewerId = req.userId!;
    //   await AgentRequestService.respondToRequest(requestId, status, reviewerId);
      res.json({ message: 'Request updated successfully' });
    } catch (err) {
      next(err);
    }
  }
}