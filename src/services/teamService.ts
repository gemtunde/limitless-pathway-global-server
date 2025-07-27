//import { TeamMember, ITeamMember } from '../models/team.model';
///import { CreateTeamMemberData, UpdateTeamMemberData, TeamQueryData } from '../validators';

import {
  CreateTeamMemberData,
  TeamQueryData,
  UpdateTeamMemberData,
} from "../lib/validations/teamValidations";
import { ITeamMember, TeamMember } from "../models/Team";

export class TeamService {
  async createTeamMember(data: CreateTeamMemberData): Promise<ITeamMember> {
    try {
      // Check if email already exists
      const existingMember = await TeamMember.findOne({ email: data.email });
      if (existingMember) {
        throw new Error("A team member with this email already exists");
      }

      const teamMember = new TeamMember(data);
      return await teamMember.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("A team member with this email already exists");
      }
      throw error;
    }
  }

  async getAllTeamMembers(query: TeamQueryData): Promise<{
    teamMembers: ITeamMember[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMembers: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const { page, limit, search, department, status, sortBy, sortOrder } =
      query;

    // Build filter object
    const filter: any = {};

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

    if (department) filter.department = department;
    if (status) filter.status = status;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count and team members
    const [teamMembers, totalMembers] = await Promise.all([
      TeamMember.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      TeamMember.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalMembers / limit);

    return {
      teamMembers: teamMembers as ITeamMember[],
      pagination: {
        currentPage: page,
        totalPages,
        totalMembers,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getTeamMemberById(id: string): Promise<ITeamMember | null> {
    return await TeamMember.findById(id);
  }

  async getTeamMemberByEmail(email: string): Promise<ITeamMember | null> {
    return await TeamMember.findOne({ email: email.toLowerCase() });
  }

  async updateTeamMember(
    id: string,
    data: UpdateTeamMemberData
  ): Promise<ITeamMember | null> {
    try {
      // If email is being updated, check if it already exists
      if (data.email) {
        const existingMember = await TeamMember.findOne({
          email: data.email.toLowerCase(),
          _id: { $ne: id },
        });
        if (existingMember) {
          throw new Error("A team member with this email already exists");
        }
      }

      return await TeamMember.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("A team member with this email already exists");
      }
      throw error;
    }
  }

  async deleteTeamMember(id: string): Promise<ITeamMember | null> {
    return await TeamMember.findByIdAndDelete(id);
  }

  async getActiveTeamMembers(query: Partial<TeamQueryData>): Promise<{
    teamMembers: ITeamMember[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalMembers: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    return this.getAllTeamMembers({
      ...query,
      status: "active",
    } as TeamQueryData);
  }

  async getTeamMembersByDepartment(
    department: string,
    limit?: number
  ): Promise<ITeamMember[]> {
    const query = TeamMember.find({ department, status: "active" }).sort({
      joinDate: 1,
    });

    if (limit) {
      query.limit(limit);
    }

    return (await query.lean()) as ITeamMember[];
  }

  async getTeamStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
    departmentCounts: Array<{ department: string; count: number }>;
    recentJoins: number; // joined in last 30 days
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [statusStats, departmentStats, recentJoins] = await Promise.all([
      TeamMember.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      TeamMember.aggregate([
        {
          $group: {
            _id: "$department",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      TeamMember.countDocuments({
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
      if (stat._id === "active") result.active = stat.count;
      else if (stat._id === "inactive") result.inactive = stat.count;
      else if (stat._id === "on-leave") result.onLeave = stat.count;
    });

    return result;
  }

  async updateTeamMemberStatus(
    id: string,
    status: "active" | "inactive" | "on-leave"
  ): Promise<ITeamMember | null> {
    return await TeamMember.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  async getTeamMembersByStatus(
    status: "active" | "inactive" | "on-leave"
  ): Promise<ITeamMember[]> {
    return (await TeamMember.find({ status })
      .sort({ name: 1 })
      .lean()) as ITeamMember[];
  }

  async searchTeamMembers(
    searchTerm: string,
    limit?: number
  ): Promise<ITeamMember[]> {
    const query = TeamMember.find({
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

    return (await query.lean()) as ITeamMember[];
  }
}
