"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationPriority = exports.ApplicationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Enums for better type safety
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["NEW"] = "new";
    ApplicationStatus["REVIEWING"] = "reviewing";
    ApplicationStatus["CONTACTED"] = "contacted";
    ApplicationStatus["ACCEPTED"] = "accepted";
    ApplicationStatus["REJECTED"] = "rejected";
    ApplicationStatus["COMPLETED"] = "completed";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
var ApplicationPriority;
(function (ApplicationPriority) {
    ApplicationPriority["LOW"] = "low";
    ApplicationPriority["MEDIUM"] = "medium";
    ApplicationPriority["HIGH"] = "high";
})(ApplicationPriority || (exports.ApplicationPriority = ApplicationPriority = {}));
const applicationSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
        ],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
    },
    nationality: {
        type: String,
        required: [true, "Nationality is required"],
        trim: true,
    },
    country: {
        type: String,
        required: [true, "Preferred country is required"],
        trim: true,
    },
    course: {
        type: String,
        required: [true, "Course of interest is required"],
        trim: true,
    },
    budget: {
        type: String,
        required: [true, "Budget is required"],
        trim: true,
    },
    qualification: {
        type: String,
        required: [true, "Educational qualification is required"],
        trim: true,
    },
    message: {
        type: String,
        trim: true,
        maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
        type: String,
        enum: Object.values(ApplicationStatus),
        default: ApplicationStatus.NEW,
    },
    priority: {
        type: String,
        enum: Object.values(ApplicationPriority),
        default: ApplicationPriority.MEDIUM,
    },
    assignedTo: {
        type: String,
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// Virtual for full name
applicationSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
});
// Index for better query performance
applicationSchema.index({ email: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ priority: 1 });
applicationSchema.index({ createdAt: -1 });
const Application = mongoose_1.default.model("Application", applicationSchema);
exports.default = Application;
