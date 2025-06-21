import { getUser } from "@civic/auth/nextjs";

export const checkUser = async () => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  try {
    // Return the basic user info from Civic Auth
    // without database operations
    return {
      civicUserId: user.sub,
      name: user.name || "User",
      imageUrl: user.picture || "",
      email: user.email || "",
      // Include any other necessary user properties
    };
  } catch (error) {
    console.log(error.message);
  }
};
