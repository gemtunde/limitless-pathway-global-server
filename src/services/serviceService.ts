//import { ServiceModel, IService } from '../models/serviceModel.js';
//import { CreateServiceInput, UpdateServiceInput } from '../validators/serviceValidators.js';

import {
  CreateServiceInput,
  UpdateServiceInput,
} from "../lib/validations/serviceValidations";
import { IService, ServiceModel } from "../models/Service";

export const servicesService = {
  // Get all services
  getAllServices: async (): Promise<IService[]> => {
    try {
      const services = await ServiceModel.find().sort({ createdAt: -1 });
      return services;
    } catch (error) {
      throw new Error(`Error fetching services: ${(error as Error).message}`);
    }
  },

  // Get service by ID
  getServiceById: async (id: string): Promise<IService | null> => {
    try {
      const service = await ServiceModel.findById(id);
      return service;
    } catch (error) {
      throw new Error(`Error fetching service: ${(error as Error).message}`);
    }
  },

  // Create new service
  createService: async (serviceData: CreateServiceInput): Promise<IService> => {
    try {
      const newService = new ServiceModel(serviceData);
      const savedService = await newService.save();
      return savedService;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Service with this title already exists");
      }
      throw new Error(`Error creating service: ${error.message}`);
    }
  },

  // Update service
  updateService: async (
    id: string,
    updateData: UpdateServiceInput
  ): Promise<IService | null> => {
    try {
      const updatedService = await ServiceModel.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      return updatedService;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Service with this title already exists");
      }
      throw new Error(`Error updating service: ${error.message}`);
    }
  },

  // Delete service
  deleteService: async (id: string): Promise<IService | null> => {
    try {
      const deletedService = await ServiceModel.findByIdAndDelete(id);
      return deletedService;
    } catch (error) {
      throw new Error(`Error deleting service: ${(error as Error).message}`);
    }
  },
};
