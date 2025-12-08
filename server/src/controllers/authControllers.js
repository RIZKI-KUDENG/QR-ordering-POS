import { createUser, loginUser } from "../services/authService.js";

export const register = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { token, user } = await loginUser(username, password);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
