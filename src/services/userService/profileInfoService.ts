import { UserRepository } from "../../repositories/UserRepository";

export class ProfileInfoService{
    async updateAboutMe(userId:number  , aboutMe:string):Promise<void>{
        await UserRepository.updateAboutMe(userId , aboutMe);
    }
    async updateUserPhone(userId:number , phone:string ):Promise<void>{
        await UserRepository.updatePhone(userId , phone);
    }
}