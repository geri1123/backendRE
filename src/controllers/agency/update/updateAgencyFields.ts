import { Request, Response, NextFunction } from "express";
import { updateAgencyInfoService } from "../../../services/AgencyService/UpdateAgencyInfo";
import { AgencyRepository } from "../../../repositories/agency/AgencyRepository";
import { ValidationError } from "../../../errors/BaseError";

const agencyrepo=new AgencyRepository();
const service = new updateAgencyInfoService(agencyrepo);

export const updateAgencyFields = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const agencyId = req.agencyId; 
    if (!agencyId) {
      throw new ValidationError({ agencyId: "Agency ID is required" });
    }
    const { name, agency_email, phone , address , website } = req.body;

    if (!name && !agency_email && !phone && !address && !website) {
      throw new ValidationError({ general: "No fields provided to update" });
    }

    if (name) await service.changeAgencyName(agencyId, name);
    if (agency_email) await service.changeAgencyEmail(agencyId, agency_email);
    if (phone) await service.changeAgencyPhone(agencyId, phone);
    if(address) await service.changeAgencyAddress(agencyId, address);   
    if(website) await service.changeAgencyWebsite(agencyId,  website );
    res.status(200).json({ message: "Agency updated successfully" });
  } catch (err) {
    next(err);
  }
};