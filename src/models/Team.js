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
exports.TeamMember = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const teamMemberSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
        maxlength: [100, "Job title cannot exceed 100 characters"],
    },
    department: {
        type: String,
        required: [true, "Department is required"],
        enum: {
            values: [
                "management",
                "project-management",
                "counseling",
                "admissions",
                "visa-processing",
                "marketing",
                "finance",
                "customer-support",
            ],
            message: "Invalid department",
        },
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
        ],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, "Location cannot exceed 100 characters"],
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    image: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v)
                    return true; // Optional field
                const urlRegex = /^https?:\/\/.+/;
                return urlRegex.test(v);
            },
            message: "Image must be a valid URL",
        },
    },
    linkedIn: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v)
                    return true; // Optional field
                const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/;
                return linkedInRegex.test(v);
            },
            message: "LinkedIn must be a valid LinkedIn profile URL",
        },
    },
    twitter: {
        type: String,
        trim: true,
        maxlength: [50, "Twitter handle cannot exceed 50 characters"],
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["active", "inactive", "on-leave"],
            message: "Invalid status",
        },
        default: "active",
    },
    joinDate: {
        type: Date,
        required: [true, "Join date is required"],
    },
    skills: {
        type: String,
        trim: true,
        maxlength: [300, "Skills cannot exceed 300 characters"],
    },
    languages: {
        type: String,
        trim: true,
        maxlength: [200, "Languages cannot exceed 200 characters"],
    },
}, {
    timestamps: true,
    //   toJSON: {
    //     transform: (doc, ret) => {
    //       ret.id = ret._id;
    //       delete ret._id;
    //       delete ret.__v;
    //       return ret;
    //     }
    //   }
});
// Indexes for better query performance
teamMemberSchema.index({ email: 1 });
teamMemberSchema.index({ department: 1 });
teamMemberSchema.index({ status: 1 });
teamMemberSchema.index({ joinDate: -1 });
teamMemberSchema.index({ name: 1 });
// Compound indexes
teamMemberSchema.index({ department: 1, status: 1 });
teamMemberSchema.index({ status: 1, joinDate: -1 });
exports.TeamMember = mongoose_1.default.model("TeamMember", teamMemberSchema);
