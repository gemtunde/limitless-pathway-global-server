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
exports.ServiceModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const serviceSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        unique: true,
        maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    icon: {
        type: String,
        required: [true, "Icon is required"],
        enum: {
            values: ["globe", "graduation-cap", "users", "book"],
            message: "Icon must be one of: globe, graduation-cap, users, book",
        },
    },
    color: {
        type: String,
        required: [true, "Color is required"],
        enum: {
            values: ["green", "red", "blue", "yellow"],
            message: "Color must be one of: green, red, blue, yellow",
        },
    },
    features: {
        type: String,
        required: [true, "Features are required"],
        trim: true,
        maxlength: [2000, "Features cannot exceed 2000 characters"],
    },
}, {
    timestamps: true,
    //   toJSON: {
    //     transform: function(doc, ret) {
    //       ret.id = ret._id;
    //       delete ret._id;
    //       delete ret.__v;
    //       return ret;
    //     }
    //   }
});
// Index for better query performance
serviceSchema.index({ title: 1 });
serviceSchema.index({ createdAt: -1 });
exports.ServiceModel = mongoose_1.default.model("Service", serviceSchema);
