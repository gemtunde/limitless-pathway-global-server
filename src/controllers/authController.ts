import { Request, Response } from "express";
import { ZodError } from "zod";
import { ApiResponse, UserResponse } from "../types/index";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../lib/validations/auth.validation";
import authService from "../services/authService";

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const user = await authService.registerUser(validatedData);

      const response: ApiResponse<{ user: UserResponse }> = {
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
          },
        },
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        };
        res.status(400).json(response);
        return;
      }

      if (
        error instanceof Error &&
        error.message === "User already exists with this email"
      ) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(409).json(response);
        return;
      }

      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const validatedData = loginSchema.parse(req.body);
      const { email, password } = validatedData;

      // Login user
      const user = await authService.loginUser(email, password);

      const response: ApiResponse<{ user: UserResponse }> = {
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        };
        res.status(400).json(response);
        return;
      }

      if (
        error instanceof Error &&
        error.message === "Invalid email or password"
      ) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(401).json(response);
        return;
      }

      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const validatedData = forgotPasswordSchema.parse(req.body);
      const { email } = validatedData;

      // Initiate password reset
      const result = await authService.initiatePasswordReset(email);

      const response: ApiResponse = {
        success: true,
        message: result.message,
        // Remove resetToken in production
        ...(result.resetToken && { resetToken: result.resetToken }),
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const validatedData = resetPasswordSchema.parse(req.body);
      const { token, password } = validatedData;

      // Reset password
      const user = await authService.resetPassword(token, password);

      const response: ApiResponse<{ user: Partial<UserResponse> }> = {
        success: true,
        message: "Password reset successfully",
        data: {
          user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        };
        res.status(400).json(response);
        return;
      }

      if (
        error instanceof Error &&
        error.message === "Invalid or expired reset token"
      ) {
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(400).json(response);
        return;
      }

      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await authService.getUserById(userId);

      const response: ApiResponse<{ user: UserResponse }> = {
        success: true,
        message: "Profile retrieved successfully",
        data: {
          user: {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error && error.message === "User not found") {
        const response: ApiResponse = {
          success: false,
          message: error.message,
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        status: 200,
        message: "Logged out successfully",
        data: {
          message: "Please remove the token from client storage",
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error",
        data: null,
      });
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const validatedData = changePasswordSchema.parse(req.body);

      const { userId } = req.params;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: "Authentication required",
        };
        res.status(401).json(response);
        return;
      }

      // Change password
      await authService.changeUserPassword(userId, validatedData);

      const response: ApiResponse = {
        success: true,
        message: "Password changed successfully",
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        };
        res.status(400).json(response);
        return;
      }

      if (error instanceof Error) {
        if (error.message === "User not found") {
          const response: ApiResponse = {
            success: false,
            message: error.message,
          };
          res.status(404).json(response);
          return;
        }

        if (error.message === "Current password is incorrect") {
          const response: ApiResponse = {
            success: false,
            message: error.message,
          };
          res.status(400).json(response);
          return;
        }
      }

      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const validatedData = updateProfileSchema.parse(req.body);

      // Get user ID from authenticated request
      //const userId = req.user?.id;
      const { userId } = req.params;
      if (!userId) {
        const response: ApiResponse = {
          success: false,
          message: "Authentication required",
        };
        res.status(401).json(response);
        return;
      }

      // Update user profile
      const updatedUser = await authService.updateUserProfile(
        userId,
        validatedData
      );

      const response: ApiResponse<{ user: UserResponse }> = {
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: updatedUser._id.toString(),
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            image: updatedUser.image,
            isEmailVerified: updatedUser.isEmailVerified,
            createdAt: updatedUser.createdAt,
            //updatedAt: updatedUser.updatedAt,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        const response: ApiResponse = {
          success: false,
          message: "Validation error",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        };
        res.status(400).json(response);
        return;
      }

      if (error instanceof Error) {
        if (error.message === "User not found") {
          const response: ApiResponse = {
            success: false,
            message: error.message,
          };
          res.status(404).json(response);
          return;
        }
      }

      const response: ApiResponse = {
        success: false,
        message: "Internal server error",
      };
      res.status(500).json(response);
    }
  }
}

export default new AuthController();
