"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    app: {
        port: process.env.PORT || 3000,
        env: process.env.NODE_ENV || "development",
        baseUrl: process.env.BASE_URL || "http://localhost:3000",
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/payments-app",
    },
    jwt: {
        secret: process.env.JWT_SECRET || "your_jwt_secret",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        refreshSecret: process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret",
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },
    email: {
        service: process.env.EMAIL_SERVICE || "gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        from: process.env.EMAIL_FROM || "no-reply@swiftpay.com",
    },
    paystack: {
        baseUrl: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co",
        secretKey: process.env.PAYSTACK_SECRET_KEY,
        publicKey: process.env.PAYSTACK_PUBLIC_KEY,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publicKey: process.env.STRIPE_PUBLIC_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    sumsub: {
        baseUrl: process.env.SUMSUB_BASE_URL || "https://api.sumsub.com",
        appToken: process.env.SUMSUB_APP_TOKEN,
        secretKey: process.env.SUMSUB_SECRET_KEY,
    },
    verifyMe: {
        baseUrl: process.env.VERIFYME_BASE_URL || "https://api.verify.me",
        apiKey: process.env.VERIFYME_API_KEY,
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
};
