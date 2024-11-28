import { AppDataSource } from "../../data-source";
import { City } from "../../entity/City";

export default async function handler(req, res) {
  const cityRepository = AppDataSource.getRepository(City);
  try {
    
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

   
    if (req.method === "DELETE") {
      const { id } = req.body;
  
      if (!id) {
        return res.status(400).json({ error: "City ID is required" });
      }
  
      try {
       
        const city = await cityRepository.findOne({ where: { id } });
  
        if (!city) {
          return res.status(404).json({ error: "City not found" });
        }
  
       
        await cityRepository.remove(city);
  
        return res.status(200).json({ message: "City removed from favorites" });
      } catch (error) {
        console.error("Error removing city:", error);
        return res
          .status(500)
          .json({ error: "An error occurred while removing the city" });
      }}
    if (req.method === "POST") {
      const { id, name, lat, lng } = req.body;

      
      if (!id || !name || lat == null || lng == null) {
        return res
          .status(400)
          .json({ error: "All fields (id, name, lat, lng) are required." });
      }

      
      const existingCity = await cityRepository.findOneBy({ id });
      if (existingCity) {
        return res
          .status(409)
          .json({ error: "City already exists in favorites." });
      }

    
      const newCity = cityRepository.create({ id, name, lat, lng });
      await cityRepository.save(newCity);

      return res
        .status(201)
        .json({ message: "City added successfully!", city: newCity });
    } else  if (req.method === "GET") {
      const { id } = req.query;
  
      if (id) {
     
        try {
          const city = await cityRepository.findOne({ where: { id } });
          if (city) {
            return res.status(200).json({ isFavorite: true });
          } else {
            return res.status(200).json({ isFavorite: false });
          }
        } catch (error) {
          console.error("Error checking favorite status:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
       
        try {
          const cities = await cityRepository.find();
          return res.status(200).json(cities);
        } catch (error) {
          console.error("Error fetching favorite cities:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
