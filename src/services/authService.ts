import User from "../models/User.js";
import crypto from "crypto";
import {
  IUser,
  RegisterFormData,
  AuthServiceResponse,
} from "../types/index.js";

class AuthService {
  async registerUser(userData: RegisterFormData): Promise<IUser> {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();
    return user;
  }

  async loginUser(email: string, password: string): Promise<IUser> {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return user;
  }

  async initiatePasswordReset(email: string): Promise<AuthServiceResponse> {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal that user doesn't exist
      return { message: "If the email exists, you will receive a reset link" };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set reset token and expiration (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // In a real app, you would send an email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return {
      message: "If the email exists, you will receive a reset link",
      // Remove this in production - only for testing
      resetToken:
        process.env.NODE_ENV === "development" ? resetToken : undefined,
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<IUser> {
    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return user;
  }

  async getUserById(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}

export default new AuthService();
