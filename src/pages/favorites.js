import Navbar from "@/components/navbar";
import { Text, Box, VStack, Flex, Button } from "@chakra-ui/react";
import { useState, useEffect } from 'react';

export default function Favorites() {
  const [cities, setCities] = useState([]);

  const removeFavorite = async (id) => {
    const response = await fetch(`/api/cities`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      alert("City was removed from favorites!");
     
      setCities((prevCities) => prevCities.filter(city => city.id !== id));
    } else {
      alert("Failed to remove from favorites.");
    }
  };

  useEffect(() => {
    fetch('/api/cities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCities(data);
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch((error) => console.error('Error fetching cities:', error));
  }, []);

  return (
    <>
      <Navbar />
      <Box mt={8} px={4}>
     
        <Box textAlign="center" mb={6}>
          <Text textStyle="3xl" color="teal">
            Favorite Cities
          </Text>
        </Box>

      
        <Box maxW="xl" mx="auto" p={4} bg="white" borderRadius="md" boxShadow="md">
          {cities.length > 0 ? (
            <VStack spacing={4} align="stretch">
              {cities.map((city) => (
                <Box
                  as="li"
                  key={city.id}
                  p={4}
                  borderRadius="md"
                  bg="gray.50"
                  boxShadow="sm"
                  mb={4}
                >
                  <Flex direction="column" gap={3}>
                    <Text fontSize="xl" fontWeight="bold">{city.name}</Text>
                    <Text>Lat: {city.lat}</Text>
                    <Text>Lng: {city.lng}</Text>
                    <Button
                      colorScheme="teal"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFavorite(city.id)}
                    >
                      Remove from Favorites
                    </Button>
                  </Flex>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No favorite cities found.</Text>
          )}
        </Box>
      </Box>
    </>
  );
}
