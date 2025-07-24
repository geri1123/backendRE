import { Request , Response , NextFunction } from "express"


export const getAgentsRequests=async(req:Request , res:Response , next:NextFunction):Promise<void>=>{
    const userId=req.userId;
    const agencyId=req.agencyId
    try{

    } catch(err){
        next(err);
    }
}