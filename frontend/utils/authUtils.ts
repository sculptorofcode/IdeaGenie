import mongoose, { Model } from 'mongoose';
import { getUser } from "@civic/auth/nextjs";
import UserModel from '../models/user';
import type { IUser } from '../models/user';

// Use a properly typed version of the model
const User: Model<IUser> = UserModel as Model<IUser>;

/**
 * Synchronize the authenticated user's information with MongoDB
 * This function should be called when a user signs in or signs up
 * It creates a new user document if one doesn't exist, or updates an existing one
 * 
 * @returns The user document from MongoDB
 */
export async function syncUserWithDatabase(): Promise<IUser | null> {
  try {
    // Get the authenticated user from Civic Auth
    const authUser = await getUser();
    
    if (!authUser) {
      console.log("No authenticated user found");
      return null;
    }

    console.log("Auth user found:", authUser.id, authUser.name);
    
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState !== 1) {
      console.log("Connecting to MongoDB...");
      try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log("MongoDB connection established");
      } catch (connError) {
        console.error("MongoDB connection error:", connError);
        throw new Error(`Database connection failed: ${connError instanceof Error ? connError.message : 'Unknown error'}`);
      }
    } else {
      console.log("MongoDB already connected");
    }
    
    try {
      // Check if the user already exists in our database
      console.log(`Looking for user with civicUserId: ${authUser.id}`);
      let user = await User.findOne({ civicUserId: authUser.id });
      
      if (user) {
        console.log("Existing user found:", user.username);
        // Update existing user with latest information
        user.username = authUser.name || user.username;
        user.email = authUser.email || user.email;
        user.lastLogin = new Date();
        await user.save();
        console.log("User updated in database:", user.username);
      } else {
        console.log("User not found, creating new user");
        // Create a new user document
        user = new User({
          civicUserId: authUser.id,
          username: authUser.name || 'New User',
          email: authUser.email,
          joinedAt: new Date(),
          lastLogin: new Date()
        } as IUser);
        await user.save();
        console.log("New user created in database:", user.username);
      }
      
      return user;
    } catch (dbError) {
      console.error("Database operation error:", dbError);
      throw new Error(`Database operation failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error syncing user with database:", error);
    throw error; // Rethrow to allow proper error handling upstream
  }
}

/**
 * Get the current user's MongoDB document
 * First tries to get from MongoDB using the authenticated user's ID
 * Falls back to basic auth user info if database is not accessible
 * 
 * @returns User document or basic user info object
 */
export async function getCurrentUser() {
  try {
    const authUser = await getUser();
    
    if (!authUser) {
      return null;
    }
    
    // Try to get from MongoDB first
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ civicUserId: authUser.sub });
      
      if (user) {
        return {
          _id: user._id,
          civicUserId: user.civicUserId,
          username: user.username,
          email: user.email,
          joinedAt: user.joinedAt,
          lastLogin: user.lastLogin
        };
      }
    }
    
    // Fall back to basic auth user info
    return {
      civicUserId: authUser.sub,
      username: authUser.name || "User",
      email: authUser.email || "",
      picture: authUser.picture || ""
    };
    
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
