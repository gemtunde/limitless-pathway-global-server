import Scholarship from "../models/Scholarship";
import {
  IScholarship,
  ScholarshipQuery,
  PaginationMeta,
  ScholarshipStats,
} from "../types/index.js";

class ScholarshipService {
  // Get all scholarships with optional filtering and pagination
  async getAllScholarships(query: ScholarshipQuery = {}) {
    const {
      page = "1",
      limit = "10",
      search,
      status,
      category,
      level,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter: any = {};

    // Add search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Add filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (level) filter.level = level;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Create sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    try {
      const scholarships = await Scholarship.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Scholarship.countDocuments(filter);
      const totalPages = Math.ceil(total / parseInt(limit));

      const pagination: PaginationMeta = {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      };

      return {
        scholarships,
        pagination,
      };
    } catch (error) {
      throw new Error(
        `Error fetching scholarships: ${(error as Error).message}`
      );
    }
  }

  // Get scholarship by ID
  //   async getScholarshipById(id: string): Promise<IScholarship> {
  //     try {
  //       const scholarship = await Scholarship.findById(id);
  //       if (!scholarship) {
  //         throw new Error('Scholarship not found');
  //       }
  //       return scholarship;
  //     } catch (error) {
  //       throw new Error(`Error fetching scholarship: ${(error as Error).message}`);
  //     }
  //   }

  // Create new scholarship
  async createScholarship(
    scholarshipData: Partial<IScholarship>
  ): Promise<IScholarship> {
    try {
      const scholarship = new Scholarship(scholarshipData);
      return await scholarship.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Scholarship with this title already exists");
      }
      throw new Error(`Error creating scholarship: ${error.message}`);
    }
  }

  // Update scholarship
  async updateScholarship(
    id: string,
    updateData: Partial<IScholarship>
  ): Promise<IScholarship> {
    try {
      const scholarship = await Scholarship.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!scholarship) {
        throw new Error("Scholarship not found");
      }

      return scholarship;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Scholarship with this title already exists");
      }
      throw new Error(`Error updating scholarship: ${error.message}`);
    }
  }

  // Delete scholarship
  async deleteScholarship(id: string): Promise<IScholarship> {
    try {
      const scholarship = await Scholarship.findByIdAndDelete(id);
      if (!scholarship) {
        throw new Error("Scholarship not found");
      }
      return scholarship;
    } catch (error) {
      throw new Error(
        `Error deleting scholarship: ${(error as Error).message}`
      );
    }
  }

  // Get scholarships statistics
  //   async getScholarshipStats(): Promise<ScholarshipStats> {
  //     try {
  //       const stats = await Scholarship.aggregate([
  //         {
  //           $group: {
  //             _id: null,
  //             total: { $sum: 1 },
  //             active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
  //             inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
  //             expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
  //           }
  //         }
  //       ]);

  //       const categoryStats = await Scholarship.aggregate([
  //         {
  //           $group: {
  //             _id: '$category',
  //             count: { $sum: 1 }
  //           }
  //         }
  //       ]);

  //       return {
  //         overview: stats[0] || { total: 0, active: 0, inactive: 0, expired: 0 },
  //         byCategory: categoryStats
  //       };
  //     } catch (error) {
  //       throw new Error(`Error fetching scholarship statistics: ${(error as Error).message}`);
  //     }
  //   }
}

const scholarshipService = new ScholarshipService();
export default scholarshipService;
