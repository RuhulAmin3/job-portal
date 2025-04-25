import { JobType } from "@prisma/client";

export type IParams = {
  searchTerm?: string;
  title?: string;
  type?: JobType;
  level?: string;
  salary?: string;
  shift?: string;
};
