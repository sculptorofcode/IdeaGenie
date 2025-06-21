import { NextRequest, NextResponse } from 'next/server';
import { getUser } from "@civic/auth/nextjs";
import { syncUserWithDatabase } from '../../../../utils/authUtils';
import connectDB from '../../../lib/database/mongodb';

/**
 * API route to synchronize the currently authenticated user with the database
 * This is called after sign-in or sign-up to ensure the user exists in MongoDB
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if there's an authenticated user
    const authUser = await getUser();
    console.log('Auth user from Civic:', authUser ? 'Found' : 'Not found');
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Ensure database connection is established
    await connectDB();
    
    // Sync user with database
    console.log('Syncing user with database...');
    const user = await syncUserWithDatabase();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Failed to sync user with database' },
        { status: 500 }
      );
    }
    
    // Return the user data
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        civicUserId: user.civicUserId,
        username: user.username,
        email: user.email,
        joinedAt: user.joinedAt,
        lastLogin: user.lastLogin
      }
    });
      } catch (error) {
    console.error('Error syncing user:', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unknown error occurred';
    const errorStack = error instanceof Error 
      ? error.stack 
      : 'No stack trace available';
      
    console.error('Error details:', { message: errorMessage, stack: errorStack });
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to sync user',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}
