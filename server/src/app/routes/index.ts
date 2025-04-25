import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { categoryRoutes } from "../modules/Category/Category.routes";
import { jobRoutes } from "../modules/Job/Job.routes";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path:"/category",
    route:categoryRoutes
  }, 
  {
    path:"/job",
    route:jobRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
