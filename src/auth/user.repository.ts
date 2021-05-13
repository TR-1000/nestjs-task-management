import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto) {
        const { username, password }  = authCredentialsDto;
        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);


       try {
        await user.save();
       } catch (error) {
           console.log(error.detail);
           return error;
       }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async validateUserPassWord(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password }  = authCredentialsDto;
        const user = await this.findOne({ username });

        if (user && await user.validateUserPassWord(password)) {
            return user.username;
        } else {
            return null;
        }
        
    }

}