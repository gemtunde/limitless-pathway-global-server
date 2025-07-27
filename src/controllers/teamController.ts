import { Request, Response } from "express";
// import { TeamService } from '../services/team.service';
// import {
//   createTeamMemberSchema,
//   updateTeamMemberSchema,
//   teamQuerySchema,
//   mongoIdSchema
// } from '../validators';
import { ZodError } from "zod";
import { z } from "zod";
import { TeamService } from "../services/teamService";
import {
  createTeamMemberSchema,
  teamQuerySchema,
  updateTeamMemberSchema,
} from "../lib/validations/teamValidations";
import { mongoIdSchema } from "../lib/validations/faqValidation";

export class TeamController {
  private teamService: TeamService;

  constructor() {
    this.teamService = new TeamService();
  }

  // Create a new team member
  createTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createTeamMemberSchema.parse(req.body);
      const teamMember = await this.teamService.createTeamMember(validatedData);

      res.status(201).json({
        success: true,
        message: "Team member created successfully",
        data: teamMember,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Failed to create team member",
        });
      }
    }
  };

  // Get all team members with filtering and pagination
  getAllTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryData = teamQuerySchema.parse(req.query);
      const result = await this.teamService.getAllTeamMembers(queryData);

      res.status(200).json({
        success: true,
        message: "Team members retrieved successfully",
        data: result.teamMembers,
        pagination: result.pagination,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve team members",
        });
      }
    }
  };

  // Get a single team member by ID
  getTeamMemberById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const teamMember = await this.teamService.getTeamMemberById(id);

      if (!teamMember) {
        res.status(404).json({
          success: false,
          message: "Team member not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Team member retrieved successfully",
        data: teamMember,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid team member ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve team member",
        });
      }
    }
  };

  // Get a team member by email
  getTeamMemberByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const emailSchema = z.object({
        email: z.string().email("Invalid email address"),
      });

      const { email } = emailSchema.parse(req.params);
      const teamMember = await this.teamService.getTeamMemberByEmail(email);

      if (!teamMember) {
        res.status(404).json({
          success: false,
          message: "Team member not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Team member retrieved successfully",
        data: teamMember,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid email format",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve team member",
        });
      }
    }
  };

  // Update a team member
  updateTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const validatedData = updateTeamMemberSchema.parse(req.body);

      const teamMember = await this.teamService.updateTeamMember(
        id,
        validatedData
      );

      if (!teamMember) {
        res.status(404).json({
          success: false,
          message: "Team member not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Team member updated successfully",
        data: teamMember,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message || "Failed to update team member",
        });
      }
    }
  };

  // Delete a team member
  deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const teamMember = await this.teamService.deleteTeamMember(id);

      if (!teamMember) {
        res.status(404).json({
          success: false,
          message: "Team member not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Team member deleted successfully",
        data: teamMember,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid team member ID",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to delete team member",
        });
      }
    }
  };

  // Get active team members (public endpoint)
  getActiveTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const queryData = teamQuerySchema.parse(req.query);
      const result = await this.teamService.getActiveTeamMembers(queryData);

      res.status(200).json({
        success: true,
        message: "Active team members retrieved successfully",
        data: result.teamMembers,
        pagination: result.pagination,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve active team members",
        });
      }
    }
  };

  // Get team members by department
  getTeamMembersByDepartment = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const departmentSchema = z.object({
        department: z.string().min(1, "Department is required"),
        limit: z
          .string()
          .optional()
          .transform((val) => (val ? parseInt(val, 10) : undefined)),
      });

      const { department, limit } = departmentSchema.parse({
        department: req.params.department,
        limit: req.query.limit,
      });

      const teamMembers = await this.teamService.getTeamMembersByDepartment(
        department,
        limit
      );

      res.status(200).json({
        success: true,
        message: `Team members for department '${department}' retrieved successfully`,
        data: teamMembers,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid parameters",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message:
            error.message || "Failed to retrieve team members by department",
        });
      }
    }
  };

  // Get team statistics
  getTeamStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.teamService.getTeamStats();

      res.status(200).json({
        success: true,
        message: "Team statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve team statistics",
      });
    }
  };

  // Update team member status
  updateTeamMemberStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = mongoIdSchema.parse(req.params);
      const statusSchema = z.object({
        status: z.enum(["active", "inactive", "on-leave"], {
          errorMap: () => ({ message: "Invalid status" }),
        }),
      });

      const { status } = statusSchema.parse(req.body);
      const teamMember = await this.teamService.updateTeamMemberStatus(
        id,
        status
      );

      if (!teamMember) {
        res.status(404).json({
          success: false,
          message: "Team member not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Team member status updated successfully",
        data: teamMember,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to update team member status",
        });
      }
    }
  };

  // Get team members by status
  getTeamMembersByStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const statusSchema = z.object({
        status: z.enum(["active", "inactive", "on-leave"], {
          errorMap: () => ({ message: "Invalid status" }),
        }),
      });

      const { status } = statusSchema.parse(req.params);
      const teamMembers = await this.teamService.getTeamMembersByStatus(status);

      res.status(200).json({
        success: true,
        message: `Team members with status '${status}' retrieved successfully`,
        data: teamMembers,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid status",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to retrieve team members by status",
        });
      }
    }
  };

  // Search team members
  searchTeamMembers = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchSchema = z.object({
        q: z.string().min(1, "Search query is required"),
        limit: z
          .string()
          .optional()
          .transform((val) => (val ? parseInt(val, 10) : undefined)),
      });

      const { q, limit } = searchSchema.parse(req.query);
      const teamMembers = await this.teamService.searchTeamMembers(q, limit);

      res.status(200).json({
        success: true,
        message: `Search results for '${q}' retrieved successfully`,
        data: teamMembers,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid search parameters",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message || "Failed to search team members",
        });
      }
    }
  };
}
