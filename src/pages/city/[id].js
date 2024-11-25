import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Text, Heading } from "@chakra-ui/react";

export default function CityPage() {
  const router = useRouter();
  const { id } = router.query;
  const [cityData, setCityData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchCityData = async () => {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${id}&key=8c1d83ed26024b5a91b7d5d4660741a9`
      );
      const data = await response.json();
      const city = data.results[0];
      setCityData({
        name: city.formatted,
        country: city.components.country,
        lat: city.geometry.lat,
        lng: city.geometry.lng,
      });

      // Fetch weather data
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.geometry.lat}&longitude=${city.geometry.lng}&current_weather=true`
      );
      const weather = await weatherResponse.json();
      setWeatherData(weather.current_weather);
    };

    fetchCityData();
  }, [id]);

  if (!cityData) return <Text>Loading</Text>;

  return (
    <Box p={6}>
      <Heading as="h1" mb={4}>
        {cityData.name}
      </Heading>
      <Text>Country: {cityData.country}</Text>
      <Text>latitude: {cityData.lat}</Text>
      <Text>longitude: {cityData.lng}</Text>

      {weatherData && (
        <Box mt={6}>
          <Heading as="h2" size="md" mb={2}>
            weather
          </Heading>
          <Text>temperature: {weatherData.temperature}°C</Text>
          <Text>windspeed: {weatherData.windspeed} km/h</Text>
        </Box>
      )}
    </Box>
  );
}
