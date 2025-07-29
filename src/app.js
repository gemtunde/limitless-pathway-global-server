"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorHandler_1 = require("./middlewares/errorHandler");
const scholarship_routes_1 = __importDefault(require("./routes/scholarship.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const country_routes_1 = __importDefault(require("./routes/country.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const faq_routes_1 = __importDefault(require("./routes/faq.routes"));
const team_routes_1 = __importDefault(require("./routes/team.routes"));
const application_routes_1 = __importDefault(require("./routes/application.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const app = (0, express_1.default)();
// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 500, // limit each IP to 50 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });
app.use((0, helmet_1.default)());
//app.use(limiter);
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/faqs", faq_routes_1.default);
app.use("/api/team", team_routes_1.default);
app.use("/api/blog", blog_routes_1.default);
app.use("/api/applications", application_routes_1.default);
app.use("/api/events", event_routes_1.default);
app.use("/api/countries", country_routes_1.default);
app.use("/api/services", service_routes_1.default);
app.use("/api/scholarships", scholarship_routes_1.default);
// Error handling
app.use(errorHandler_1.errorHandler);
exports.default = app;
