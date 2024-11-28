import Head from "next/head";
import Navbar from "@/components/navbar";
import { Text, Image, AbsoluteCenter, Box, Link, Spinner, Flex, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function Home() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [randomCities, setRandomCities] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [loadingRandomCities, setLoadingRandomCities] = useState(false); 


  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavoriteCities(data);
        } else {
          console.error("Unexpected API response:", data);
        }
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  
  useEffect(() => {
    const predefinedCities = [
      "New York",
      "Paris",
      "Tokyo",
      "London",
      "Dubai",
      "Cape Town",
      "Sydney",
      "Rome",
      "Toronto",
      "Mumbai",
      "Bucharest",
      "Madrid",
      "Amsterdam"
    ]; 

    const fetchRandomCities = async () => {
      setLoadingRandomCities(true);
      try {
        const randomCityNames = predefinedCities
          .sort(() => Math.random() - 0.5) 
          .slice(0, 5); 

        const cityDataPromises = randomCityNames.map((cityName) =>
          fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
              cityName
            )}&key=8c1d83ed26024b5a91b7d5d4660741a9`
          ).then((res) => res.json())
        );

        const cityDataResponses = await Promise.all(cityDataPromises);
        const cityData = cityDataResponses.map((data, index) => {
          const city = data.results[0];
          return {
            name: city.formatted,
            country: city.components.country,
            lat: city.geometry.lat,
            lng: city.geometry.lng,
            id: `${city.geometry.lat},${city.geometry.lng}`,
          };
        });

        setRandomCities(cityData);
      } catch (error) {
        console.error("Error fetching random cities:", error);
      } finally {
        setLoadingRandomCities(false);
        setLoading(false); 
      }
    };

    fetchRandomCities();
  }, []);

  return (
    <>
      <Navbar />
      <Head>
        <title>Favorite Cities</title>
        <meta name="description" content="Favorite Cities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

  
      {loading ? (
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" color="teal" />
        </Flex>
      ) : (
        <Box>
       
          <AbsoluteCenter axis="horizontal">
            <Link href="./search">
              <Text textStyle="7xl" color="teal" fontWeight="bold">
                Search your favorite city
              </Text>
            </Link>
          </AbsoluteCenter>
          <Image
            rounded="md"
            height="400px"
            src="https://arzotravels.com/wp-content/uploads/2016/03/Untitled-design.jpg"
            alt="City view"
            width="100%"
            objectFit="cover"
          />

        
          <Box mt={8}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">
              Favorite Cities:
            </Text>
            <Box
              p={4}
              borderRadius="md"
              border="1px solid teal"
              bg="gray.50"
              boxShadow="md"
            >
              <VStack spacing={2}>
                {favoriteCities.slice(0, 5).map((city) => (
                  <Text key={city.id}>
                    {city.name} - {city.country} (Lat: {city.lat}, Lng: {city.lng})
                  </Text>
                ))}
              </VStack>
            </Box>
          </Box>

         
          <Box mt={8}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">
              Try New Cities:
            </Text>
            {loadingRandomCities ? (
              <Spinner size="lg" color="teal" />
            ) : (
              <Box
                p={4}
                borderRadius="md"
                border="1px solid teal"
                bg="gray.50"
                boxShadow="md"
              >
                <VStack spacing={2}>
                  {randomCities.map((city) => (
                    <Text key={city.id}>
                      {city.name} - {city.country} (Lat: {city.lat}, Lng: {city.lng})
                    </Text>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
