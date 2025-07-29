"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
// import { TeamService } from '../services/team.service';
// import {
//   createTeamMemberSchema,
//   updateTeamMemberSchema,
//   teamQuerySchema,
//   mongoIdSchema
// } from '../validators';
const zod_1 = require("zod");
const zod_2 = require("zod");
const teamService_1 = require("../services/teamService");
const teamValidations_1 = require("../lib/validations/teamValidations");
const faqValidation_1 = require("../lib/validations/faqValidation");
class TeamController {
    constructor() {
        // Create a new team member
        this.createTeamMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const validatedData = teamValidations_1.createTeamMemberSchema.parse(req.body);
                const teamMember = yield this.teamService.createTeamMember(validatedData);
                res.status(201).json({
                    success: true,
                    message: "Team member created successfully",
                    data: teamMember,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: error.message || "Failed to create team member",
                    });
                }
            }
        });
        // Get all team members with filtering and pagination
        this.getAllTeamMembers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryData = teamValidations_1.teamQuerySchema.parse(req.query);
                const result = yield this.teamService.getAllTeamMembers(queryData);
                res.status(200).json({
                    success: true,
                    message: "Team members retrieved successfully",
                    data: result.teamMembers,
                    pagination: result.pagination,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid query parameters",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve team members",
                    });
                }
            }
        });
        // Get a single team member by ID
        this.getTeamMemberById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const teamMember = yield this.teamService.getTeamMemberById(id);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid team member ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve team member",
                    });
                }
            }
        });
        // Get a team member by email
        this.getTeamMemberByEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const emailSchema = zod_2.z.object({
                    email: zod_2.z.string().email("Invalid email address"),
                });
                const { email } = emailSchema.parse(req.params);
                const teamMember = yield this.teamService.getTeamMemberByEmail(email);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid email format",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve team member",
                    });
                }
            }
        });
        // Update a team member
        this.updateTeamMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const validatedData = teamValidations_1.updateTeamMemberSchema.parse(req.body);
                const teamMember = yield this.teamService.updateTeamMember(id, validatedData);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: error.message || "Failed to update team member",
                    });
                }
            }
        });
        // Delete a team member
        this.deleteTeamMember = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const teamMember = yield this.teamService.deleteTeamMember(id);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid team member ID",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to delete team member",
                    });
                }
            }
        });
        // Get active team members (public endpoint)
        this.getActiveTeamMembers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const queryData = teamValidations_1.teamQuerySchema.parse(req.query);
                const result = yield this.teamService.getActiveTeamMembers(queryData);
                res.status(200).json({
                    success: true,
                    message: "Active team members retrieved successfully",
                    data: result.teamMembers,
                    pagination: result.pagination,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid query parameters",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve active team members",
                    });
                }
            }
        });
        // Get team members by department
        this.getTeamMembersByDepartment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const departmentSchema = zod_2.z.object({
                    department: zod_2.z.string().min(1, "Department is required"),
                    limit: zod_2.z
                        .string()
                        .optional()
                        .transform((val) => (val ? parseInt(val, 10) : undefined)),
                });
                const { department, limit } = departmentSchema.parse({
                    department: req.params.department,
                    limit: req.query.limit,
                });
                const teamMembers = yield this.teamService.getTeamMembersByDepartment(department, limit);
                res.status(200).json({
                    success: true,
                    message: `Team members for department '${department}' retrieved successfully`,
                    data: teamMembers,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid parameters",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve team members by department",
                    });
                }
            }
        });
        // Get team statistics
        this.getTeamStats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.teamService.getTeamStats();
                res.status(200).json({
                    success: true,
                    message: "Team statistics retrieved successfully",
                    data: stats,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: error.message || "Failed to retrieve team statistics",
                });
            }
        });
        // Update team member status
        this.updateTeamMemberStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = faqValidation_1.mongoIdSchema.parse(req.params);
                const statusSchema = zod_2.z.object({
                    status: zod_2.z.enum(["active", "inactive", "on-leave"], {
                        errorMap: () => ({ message: "Invalid status" }),
                    }),
                });
                const { status } = statusSchema.parse(req.body);
                const teamMember = yield this.teamService.updateTeamMemberStatus(id, status);
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
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Validation error",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to update team member status",
                    });
                }
            }
        });
        // Get team members by status
        this.getTeamMembersByStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const statusSchema = zod_2.z.object({
                    status: zod_2.z.enum(["active", "inactive", "on-leave"], {
                        errorMap: () => ({ message: "Invalid status" }),
                    }),
                });
                const { status } = statusSchema.parse(req.params);
                const teamMembers = yield this.teamService.getTeamMembersByStatus(status);
                res.status(200).json({
                    success: true,
                    message: `Team members with status '${status}' retrieved successfully`,
                    data: teamMembers,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid status",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to retrieve team members by status",
                    });
                }
            }
        });
        // Search team members
        this.searchTeamMembers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const searchSchema = zod_2.z.object({
                    q: zod_2.z.string().min(1, "Search query is required"),
                    limit: zod_2.z
                        .string()
                        .optional()
                        .transform((val) => (val ? parseInt(val, 10) : undefined)),
                });
                const { q, limit } = searchSchema.parse(req.query);
                const teamMembers = yield this.teamService.searchTeamMembers(q, limit);
                res.status(200).json({
                    success: true,
                    message: `Search results for '${q}' retrieved successfully`,
                    data: teamMembers,
                });
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({
                        success: false,
                        message: "Invalid search parameters",
                        errors: error.errors,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: error.message || "Failed to search team members",
                    });
                }
            }
        });
        this.teamService = new teamService_1.TeamService();
    }
}
exports.TeamController = TeamController;
