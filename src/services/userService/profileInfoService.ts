import { UserQueries  , UserUpdates} from "../../repositories/user/index.js";

export class ProfileInfoService{
    async updateAboutMe(userId:number  , aboutMe:string):Promise<void>{
        await UserUpdates.updateAboutMe(userId , aboutMe);
    }
    async updateUserPhone(userId:number , phone:string ):Promise<void>{
        await UserUpdates.updatePhone(userId , phone);
    }
    async updateFirstNlastN (userId:number , firstName:string , lastName:string):Promise<void>{
        await UserUpdates.updateFnmLnm(userId ,firstName  , lastName);
    }
}