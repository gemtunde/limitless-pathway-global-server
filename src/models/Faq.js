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
exports.FAQ = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const faqSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
        trim: true,
        maxlength: [500, "Question cannot exceed 500 characters"],
    },
    answer: {
        type: String,
        required: [true, "Answer is required"],
        trim: true,
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: {
            values: [
                "general",
                "applications",
                "scholarships",
                "visa",
                "costs",
                "countries",
                "support",
                "documents",
            ],
            message: "Invalid category",
        },
    },
    tags: {
        type: String,
        trim: true,
    },
    order: {
        type: Number,
        min: [1, "Order must be at least 1"],
        max: [1000, "Order cannot exceed 1000"],
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["published", "draft", "archived"],
            message: "Invalid status",
        },
        default: "published",
    },
    helpful: {
        type: Number,
        default: 0,
        min: [0, "Helpful count cannot be negative"],
    },
    notHelpful: {
        type: Number,
        default: 0,
        min: [0, "Not helpful count cannot be negative"],
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
faqSchema.index({ category: 1 });
faqSchema.index({ status: 1 });
faqSchema.index({ order: 1 });
faqSchema.index({ createdAt: -1 });
// Compound index for category and order
faqSchema.index({ category: 1, order: 1 });
exports.FAQ = mongoose_1.default.model("FAQ", faqSchema);
