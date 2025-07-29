"use strict";
//import { TeamMember, ITeamMember } from '../models/team.model';
///import { CreateTeamMemberData, UpdateTeamMemberData, TeamQueryData } from '../validators';
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
exports.TeamService = void 0;
const Team_1 = require("../models/Team");
class TeamService {
    createTeamMember(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if email already exists
                const existingMember = yield Team_1.TeamMember.findOne({ email: data.email });
                if (existingMember) {
                    throw new Error("A team member with this email already exists");
                }
                const teamMember = new Team_1.TeamMember(data);
                return yield teamMember.save();
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("A team member with this email already exists");
                }
                throw error;
            }
        });
    }
    getAllTeamMembers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, department, status, sortBy, sortOrder } = query;
            // Build filter object
            const filter = {};
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { bio: { $regex: search, $options: "i" } },
                    { skills: { $regex: search, $options: "i" } },
                    { location: { $regex: search, $options: "i" } },
                ];
            }
            if (department)
                filter.department = department;
            if (status)
                filter.status = status;
            // Build sort object
            const sort = {};
            sort[sortBy] = sortOrder === "asc" ? 1 : -1;
            // Calculate pagination
            const skip = (page - 1) * limit;
            // Get total count and team members
            const [teamMembers, totalMembers] = yield Promise.all([
                Team_1.TeamMember.find(filter).sort(sort).skip(skip).limit(limit).lean(),
                Team_1.TeamMember.countDocuments(filter),
            ]);
            const totalPages = Math.ceil(totalMembers / limit);
            return {
                teamMembers: teamMembers,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalMembers,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
        });
    }
    getTeamMemberById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Team_1.TeamMember.findById(id);
        });
    }
    getTeamMemberByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Team_1.TeamMember.findOne({ email: email.toLowerCase() });
        });
    }
    updateTeamMember(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If email is being updated, check if it already exists
                if (data.email) {
                    const existingMember = yield Team_1.TeamMember.findOne({
                        email: data.email.toLowerCase(),
                        _id: { $ne: id },
                    });
                    if (existingMember) {
                        throw new Error("A team member with this email already exists");
                    }
                }
                return yield Team_1.TeamMember.findByIdAndUpdate(id, Object.assign(Object.assign({}, data), { updatedAt: new Date() }), { new: true, runValidators: true });
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error("A team member with this email already exists");
                }
                throw error;
            }
        });
    }
    deleteTeamMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Team_1.TeamMember.findByIdAndDelete(id);
        });
    }
    getActiveTeamMembers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getAllTeamMembers(Object.assign(Object.assign({}, query), { status: "active" }));
        });
    }
    getTeamMembersByDepartment(department, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Team_1.TeamMember.find({ department, status: "active" }).sort({
                joinDate: 1,
            });
            if (limit) {
                query.limit(limit);
            }
            return (yield query.lean());
        });
    }
    getTeamStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const [statusStats, departmentStats, recentJoins] = yield Promise.all([
                Team_1.TeamMember.aggregate([
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 },
                        },
                    },
                ]),
                Team_1.TeamMember.aggregate([
                    {
                        $group: {
                            _id: "$department",
                            count: { $sum: 1 },
                        },
                    },
                    { $sort: { _id: 1 } },
                ]),
                Team_1.TeamMember.countDocuments({
                    joinDate: { $gte: thirtyDaysAgo },
                }),
            ]);
            const result = {
                total: 0,
                active: 0,
                inactive: 0,
                onLeave: 0,
                departmentCounts: departmentStats.map((stat) => ({
                    department: stat._id,
                    count: stat.count,
                })),
                recentJoins,
            };
            statusStats.forEach((stat) => {
                result.total += stat.count;
                if (stat._id === "active")
                    result.active = stat.count;
                else if (stat._id === "inactive")
                    result.inactive = stat.count;
                else if (stat._id === "on-leave")
                    result.onLeave = stat.count;
            });
            return result;
        });
    }
    updateTeamMemberStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Team_1.TeamMember.findByIdAndUpdate(id, { status, updatedAt: new Date() }, { new: true, runValidators: true });
        });
    }
    getTeamMembersByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield Team_1.TeamMember.find({ status })
                .sort({ name: 1 })
                .lean());
        });
    }
    searchTeamMembers(searchTerm, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = Team_1.TeamMember.find({
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } },
                    { title: { $regex: searchTerm, $options: "i" } },
                    { email: { $regex: searchTerm, $options: "i" } },
                    { skills: { $regex: searchTerm, $options: "i" } },
                    { department: { $regex: searchTerm, $options: "i" } },
                ],
            }).sort({ name: 1 });
            if (limit) {
                query.limit(limit);
            }
            return (yield query.lean());
        });
    }
}
exports.TeamService = TeamService;
