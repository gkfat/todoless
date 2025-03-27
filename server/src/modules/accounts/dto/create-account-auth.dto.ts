import { EnumLoginType } from 'src/enums';

export class CreateAccountAuthDto {
    type: EnumLoginType;

    /** account email / oauth sub */
    identifier: string;

    /** account hashed password / null */
    credential: string;
}