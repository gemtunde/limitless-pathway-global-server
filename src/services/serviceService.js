"use strict";
//import { ServiceModel, IService } from '../models/serviceModel.js';
//import { CreateServiceInput, UpdateServiceInput } from '../validators/serviceValidators.js';
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
exports.servicesService = void 0;
const Service_1 = require("../models/Service");
exports.servicesService = {
    // Get all services
    getAllServices: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const services = yield Service_1.ServiceModel.find().sort({ createdAt: -1 });
            return services;
        }
        catch (error) {
            throw new Error(`Error fetching services: ${error.message}`);
        }
    }),
    // Get service by ID
    getServiceById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const service = yield Service_1.ServiceModel.findById(id);
            return service;
        }
        catch (error) {
            throw new Error(`Error fetching service: ${error.message}`);
        }
    }),
    // Create new service
    createService: (serviceData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newService = new Service_1.ServiceModel(serviceData);
            const savedService = yield newService.save();
            return savedService;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new Error("Service with this title already exists");
            }
            throw new Error(`Error creating service: ${error.message}`);
        }
    }),
    // Update service
    updateService: (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedService = yield Service_1.ServiceModel.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true, runValidators: true });
            return updatedService;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new Error("Service with this title already exists");
            }
            throw new Error(`Error updating service: ${error.message}`);
        }
    }),
    // Delete service
    deleteService: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedService = yield Service_1.ServiceModel.findByIdAndDelete(id);
            return deletedService;
        }
        catch (error) {
            throw new Error(`Error deleting service: ${error.message}`);
        }
    }),
};
