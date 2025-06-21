import { getUser } from "@civic/auth/nextjs";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await getUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        civicUserId: user.sub,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;    const newUser = await db.user.create({
      data: {
        civicUserId: user.sub,
        name: user.name || "User",
        imageUrl: user.picture || "",
        email: user.email || "",
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};
