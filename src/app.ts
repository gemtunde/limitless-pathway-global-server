import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middlewares/errorHandler";
import scholarshipRoutes from "./routes/scholarship.routes";
import eventRoutes from "./routes/event.routes";
import countryRoutes from "./routes/country.routes";
import blogRoutes from "./routes/blog.routes";
import faqRoutes from "./routes/faq.routes";
import teamRoutes from "./routes/team.routes";
import applicationRoutes from "./routes/application.routes";
import serviceRoutes from "./routes/service.routes";

const app = express();

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 minutes
//   max: 500, // limit each IP to 50 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });

app.use(helmet());
//app.use(limiter);
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN as string) || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/faqs", faqRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/countries", countryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/scholarships", scholarshipRoutes);

// Error handling
app.use(errorHandler);

export default app;
