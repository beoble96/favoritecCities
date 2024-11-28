import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Text, Heading, Button, Spinner, Flex } from "@chakra-ui/react";
import Navbar from "@/components/navbar";

export default function CityPage() {
  const router = useRouter();
  const { id } = router.query; 
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchFavoriteStatus = async (id) => {
    try {
      const response = await fetch(`/api/cities?id=${id}`);
      const data = await response.json();
      setIsFavorite(data.isFavorite); 
    } catch (error) {
      console.error("Error checking favorite status:", error);
    }
  };

  const handleFavorite = async () => {
    if (isFavorite) {
      
      const response = await fetch(`/api/cities`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("City was removed from favorites!");
        setIsFavorite(false);
      } else {
        alert("Failed to remove from favorites.");
      }
    } else {
     
      const response = await fetch(`/api/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          id, 
          name: city.name, 
          lat: city.lat, 
          lng: city.lng 
        }),
      });

      if (response.ok) {
        alert("City was added to favorites!");
        setIsFavorite(true);
      } else {
        alert("Failed to add to favorites.");
      }
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchCityData = async () => {
      try {
        const [lat, lng] = id.split(","); 
        const geoResponse = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=8c1d83ed26024b5a91b7d5d4660741a9`
        );
        const geoData = await geoResponse.json();
        const cityData = geoData.results[0];

        setCity({
          id, 
          name: cityData.formatted,
          country: cityData.components.country,
          lat: cityData.geometry.lat,
          lng: cityData.geometry.lng,
        });

       
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
        );
        const weather = await weatherResponse.json();
        setWeatherData(weather.current_weather);

        
        fetchFavoriteStatus(id);
      } catch (error) {
        console.error("Error fetching city data:", error);
      }
    };

    fetchCityData();
  }, [id]);

  if (!city) {
    return (
      <Flex justify="center" align="center" minHeight="100vh">
        <Spinner size="xl" color="teal" />
      </Flex>
    );
  }

  return (
    <>
      <Navbar />
      <Box p={6} maxW="600px" mx="auto" mt={10} textAlign="center">
        <Heading as="h1" mb={4}>
          {city.name}
        </Heading>
        <Text fontSize="lg" color="teal.600" mb={2}>
          Country: {city.country}
        </Text>
        <Text>Latitude: {city.lat}</Text>
        <Text>Longitude: {city.lng}</Text>

        {weatherData && (
          <Box mt={6}>
            <Heading as="h2" size="md" mb={2}>
              Weather
            </Heading>
            <Text>Temperature: {weatherData.temperature}°C</Text>
            <Text>Wind Speed: {weatherData.windspeed} km/h</Text>
          </Box>
        )}

        <Button
          mt={6}
          colorScheme={isFavorite ? "red" : "teal"}
          onClick={handleFavorite}
        >
          {isFavorite ? "Remove from Favorite" : "Add to Favorite"}
        </Button>
      </Box>
    </>
  );
}
