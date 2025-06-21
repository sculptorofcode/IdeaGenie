import { getUser } from "@civic/auth/nextjs";
import { getCurrentUser } from "../utils/authUtils";

export const checkUser = async () => {
  try {
    // Use our enhanced getCurrentUser function that checks both Auth and Database
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }
    
    return {
      id: user._id || null,
      civicUserId: user.civicUserId,
      name: user.username || "User",
      imageUrl: user.picture || "",
      email: user.email || "",
    };
  } catch (error) {
    console.log(error.message);
    
    // Fall back to basic auth if there's an error
    const authUser = await getUser();
    if (authUser) {
      return {
        civicUserId: authUser.sub,
        name: authUser.name || "User",
        imageUrl: authUser.picture || "",
        email: authUser.email || "",
      };
    }
    
    return null;
  }
};
