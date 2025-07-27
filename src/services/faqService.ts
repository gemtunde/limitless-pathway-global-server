//import { FAQ, IFAQ } from '../models/faq.model';
//import { CreateFaqData, UpdateFaqData, FaqQueryData } from '../validators';

import {
  CreateFaqData,
  FaqQueryData,
  UpdateFaqData,
} from "../lib/validations/faqValidation";
import { FAQ, IFAQ } from "../models/Faq";

export class FaqService {
  async createFaq(data: CreateFaqData): Promise<IFAQ> {
    const faq = new FAQ(data);
    return await faq.save();
  }

  async getAllFaqs(query: FaqQueryData): Promise<{
    faqs: IFAQ[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalFaqs: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const { page, limit, search, category, status, sortBy, sortOrder } = query;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { question: { $regex: search, $options: "i" } },
        { answer: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    // Build sort object - handle order field specially
    const sort: any = {};
    if (sortBy === "order") {
      // For order sorting, put null/undefined values last
      sort.order = sortOrder === "asc" ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count and faqs
    const [faqs, totalFaqs] = await Promise.all([
      FAQ.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      FAQ.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalFaqs / limit);

    return {
      faqs: faqs as IFAQ[],
      pagination: {
        currentPage: page,
        totalPages,
        totalFaqs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async getFaqById(id: string): Promise<IFAQ | null> {
    return await FAQ.findById(id);
  }

  async updateFaq(id: string, data: UpdateFaqData): Promise<IFAQ | null> {
    return await FAQ.findByIdAndUpdate(
      id,
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  async deleteFaq(id: string): Promise<IFAQ | null> {
    return await FAQ.findByIdAndDelete(id);
  }

  async incrementHelpful(id: string): Promise<IFAQ | null> {
    return await FAQ.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
  }

  async incrementNotHelpful(id: string): Promise<IFAQ | null> {
    return await FAQ.findByIdAndUpdate(
      id,
      { $inc: { notHelpful: 1 } },
      { new: true }
    );
  }

  async getPublishedFaqs(query: Partial<FaqQueryData>): Promise<{
    faqs: IFAQ[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalFaqs: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    return this.getAllFaqs({ ...query, status: "published" } as FaqQueryData);
  }

  async getFaqsByCategory(category: string, limit?: number): Promise<IFAQ[]> {
    const query = FAQ.find({ category, status: "published" }).sort({
      order: 1,
      createdAt: 1,
    });

    if (limit) {
      query.limit(limit);
    }

    return (await query.lean()) as IFAQ[];
  }

  async getFaqStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    archived: number;
    totalHelpful: number;
    totalNotHelpful: number;
    categoryCounts: Array<{ category: string; count: number }>;
  }> {
    const [statusStats, helpfulStats, categoryStats] = await Promise.all([
      FAQ.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      FAQ.aggregate([
        {
          $group: {
            _id: null,
            totalHelpful: { $sum: "$helpful" },
            totalNotHelpful: { $sum: "$notHelpful" },
          },
        },
      ]),
      FAQ.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const result = {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
      totalHelpful: helpfulStats[0]?.totalHelpful || 0,
      totalNotHelpful: helpfulStats[0]?.totalNotHelpful || 0,
      categoryCounts: categoryStats.map((stat) => ({
        category: stat._id,
        count: stat.count,
      })),
    };

    statusStats.forEach((stat) => {
      result.total += stat.count;
      if (stat._id === "published") result.published = stat.count;
      else if (stat._id === "draft") result.draft = stat.count;
      else if (stat._id === "archived") result.archived = stat.count;
    });

    return result;
  }

  async reorderFaqs(
    reorderData: Array<{ id: string; order: number }>
  ): Promise<void> {
    const updatePromises = reorderData.map(({ id, order }) =>
      FAQ.findByIdAndUpdate(id, { order }, { runValidators: true })
    );

    await Promise.all(updatePromises);
  }
}
