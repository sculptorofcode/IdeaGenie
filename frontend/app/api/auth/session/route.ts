import { getUser } from '@civic/auth/nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState !== 1) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }
    await mongoose.connect(uri);
  }
}

/**
 * API Route for getting the current authenticated user session
 * Used by client components to check authentication status
 */
export async function GET() {
  try {
    // Get the authenticated user - this runs server-side so cookies work properly
    const user = await getUser();
    
    if (!user) {
      // No authenticated user found
      return NextResponse.json(
        { 
          success: false, 
          user: null,
          message: "No authenticated user found" 
        }, 
        { status: 401 }
      );
    }
      // Get MongoDB user document for the civic auth user
    await connectToDatabase();
    
    // Find or create the user in our MongoDB
    const UserModel = mongoose.models.User || require('../../../../models/user').default;
    let dbUser = await UserModel.findOne({ civicUserId: user.id });
    
    if (!dbUser) {
      // Create a new user if not found
      dbUser = await UserModel.create({
        civicUserId: user.id,
        username: user.name || 'Anonymous User',
        email: user.email,
        lastLogin: new Date()
      });
    } else {
      // Update last login time
      dbUser.lastLogin = new Date();
      await dbUser.save();
    }
    
    // Return the MongoDB ObjectId as the user ID
    return NextResponse.json({
      success: true,
      user: {
        id: dbUser._id.toString(), // Use the MongoDB ObjectId
        civicId: user.sub,
        name: user.name,
        email: user.email,
      }
    });
    
  } catch (error) {
    console.error("Error in session API route:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Authentication error",
        error: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
}
