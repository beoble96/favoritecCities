import { AppDataSource } from "../../data-source";
import { User } from "../../entity/User";

export default async function handler(req, res) {
  try {

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    if (req.method === "POST") {
      const { name, age } = req.body;

      if (!name || !age) {
        return res.status(400).json({ error: "Name and age are required" });
      }

      
      const newUser = userRepository.create({ name, age });
      await userRepository.save(newUser);

      return res.status(201).json({ message: "User added successfully!", user: newUser });
    } else if (req.method === "GET") {
      const users = await userRepository.find();
      return res.status(200).json(users);
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
