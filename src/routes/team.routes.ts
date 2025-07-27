import { Router } from "express";
import { TeamController } from "../controllers/teamController";
//import { TeamController } from '../controllers/teamController';

const router = Router();
const teamController = new TeamController();

// Admin routes (for team management)
router.post("/", teamController.createTeamMember);
router.get("/", teamController.getAllTeamMembers);
router.get("/stats", teamController.getTeamStats);
router.get("/search", teamController.searchTeamMembers);
router.get("/status/:status", teamController.getTeamMembersByStatus);
router.get("/:id", teamController.getTeamMemberById);
router.put("/:id", teamController.updateTeamMember);
router.delete("/:id", teamController.deleteTeamMember);
router.patch("/:id/status", teamController.updateTeamMemberStatus);

// Public routes (for frontend consumption)
router.get("/public/active", teamController.getActiveTeamMembers);
router.get(
  "/public/department/:department",
  teamController.getTeamMembersByDepartment
);
router.get("/public/email/:email", teamController.getTeamMemberByEmail);

export default router;
