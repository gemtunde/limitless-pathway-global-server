import Country from "../models/Country";
import { ICountry, CountryQuery, PaginationMeta, CountryStats } from "../types";

class CountryService {
  // Get all countries with optional filtering and pagination
  async getAllCountries(query: CountryQuery = {}) {
    const {
      page = "1",
      limit = "10",
      search,
      status,
      sortBy = "name",
      sortOrder = "asc",
    } = query;

    const filter: any = {};

    // Add search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Add filters
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Create sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    try {
      const countries = await Country.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Country.countDocuments(filter);
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
        countries,
        pagination,
      };
    } catch (error) {
      throw new Error(`Error fetching countries: ${(error as Error).message}`);
    }
  }

  // Get country by ID
  async getCountryById(id: string): Promise<ICountry> {
    try {
      const country = await Country.findById(id);
      if (!country) {
        throw new Error("Country not found");
      }
      return country;
    } catch (error) {
      throw new Error(`Error fetching country: ${(error as Error).message}`);
    }
  }

  // Get country by slug
  async getCountryBySlug(slug: string): Promise<ICountry> {
    try {
      const country = await Country.findOne({ slug: slug.toLowerCase() });
      if (!country) {
        throw new Error("Country not found");
      }
      return country;
    } catch (error) {
      throw new Error(`Error fetching country: ${(error as Error).message}`);
    }
  }

  // Create new country
  async createCountry(countryData: Partial<ICountry>): Promise<ICountry> {
    try {
      // Ensure slug is lowercase and flagCode is uppercase
      if (countryData.slug) {
        countryData.slug = countryData.slug.toLowerCase();
      }
      if (countryData.flagCode) {
        countryData.flagCode = countryData.flagCode.toUpperCase();
      }

      const country = new Country(countryData);
      return await country.save();
    } catch (error: any) {
      if (error.code === 11000) {
        if (error.message.includes("name")) {
          throw new Error("Country with this name already exists");
        }
        if (error.message.includes("slug")) {
          throw new Error("Country with this slug already exists");
        }
        throw new Error("Country already exists");
      }
      throw new Error(`Error creating country: ${error.message}`);
    }
  }

  // Update country
  async updateCountry(
    id: string,
    updateData: Partial<ICountry>
  ): Promise<ICountry> {
    try {
      // Ensure slug is lowercase and flagCode is uppercase
      if (updateData.slug) {
        updateData.slug = updateData.slug.toLowerCase();
      }
      if (updateData.flagCode) {
        updateData.flagCode = updateData.flagCode.toUpperCase();
      }

      const country = await Country.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!country) {
        throw new Error("Country not found");
      }

      return country;
    } catch (error: any) {
      if (error.code === 11000) {
        if (error.message.includes("name")) {
          throw new Error("Country with this name already exists");
        }
        if (error.message.includes("slug")) {
          throw new Error("Country with this slug already exists");
        }
        throw new Error("Country already exists");
      }
      throw new Error(`Error updating country: ${error.message}`);
    }
  }

  // Delete country
  async deleteCountry(id: string): Promise<ICountry> {
    try {
      const country = await Country.findByIdAndDelete(id);
      if (!country) {
        throw new Error("Country not found");
      }
      return country;
    } catch (error) {
      throw new Error(`Error deleting country: ${(error as Error).message}`);
    }
  }

  // Get active countries only
  async getActiveCountries(): Promise<ICountry[]> {
    try {
      const countries = await Country.find({ status: "active" }).sort({
        name: 1,
      });

      return countries;
    } catch (error) {
      throw new Error(
        `Error fetching active countries: ${(error as Error).message}`
      );
    }
  }

  // Get countries statistics
  async getCountryStats(): Promise<CountryStats> {
    try {
      const stats = await Country.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
            inactive: {
              $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
            },
          },
        },
      ]);

      return {
        overview: stats[0] || { total: 0, active: 0, inactive: 0 },
      };
    } catch (error) {
      throw new Error(
        `Error fetching country statistics: ${(error as Error).message}`
      );
    }
  }
}

const countryService = new CountryService();
export default countryService;
