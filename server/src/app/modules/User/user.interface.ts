import {  UserRole,} from "@prisma/client";

export interface IParams {
  searchTerm: string;
  role: UserRole;
}
