import prisma from "../db/database.js";
import {hashPassword} from "../utils/bcrypt.js";

export const createUser = async (userData) => {
    const hashed = hashPassword(userData.password);
    const user = await prisma.user.create({
        data: {
            username: userData.username,
            password: hashed,
            name: userData.name,
            role: userData.role
        }
    });
    return user
}

export const loginUser = async (username, password) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user };
};