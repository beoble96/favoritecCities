import Navbar from "@/components/navbar";
import {
  Box,
  Input,
  Button,
  Text,
  Flex,
  Link,
  Spinner,
  VStack,
  HStack,
  Image,
} from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState({});

  const handleFavorite = async (id, name, lat, lng) => {
    const isFavorite = favorites[id];
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
        setFavorites((prev) => ({ ...prev, [id]: false }));
      } else {
        alert("Failed to remove from favorites.");
      }
    } else {
      const response = await fetch(`/api/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, name, lat, lng }),
      });

      if (response.ok) {
        alert("City was added to favorites!");
        setFavorites((prev) => ({ ...prev, [id]: true }));
      } else {
        alert("Failed to add to favorites.");
      }
    }
  };

  const handleSearch = async () => {
    setError("");
    setResults([]);
    setFavorites({});
    if (!searchTerm.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          searchTerm
        )}&key=8c1d83ed26024b5a91b7d5d4660741a9`
      );

      if (!response.ok) {
        throw new Error("API error. Please try again.");
      }

      const data = await response.json();

      if (data.results.length === 0) {
        setError("No results found for your search.");
        return;
      }

      const cityResults = data.results.slice(0, 5).map((result) => {
        const { lat, lng } = result.geometry;
        const { formatted: name } = result;
        const { country, country_code } = result.components;

        return {
          id: `${lat},${lng}`,
          name,
          lat,
          lng,
          country,
          flag: `https://flagcdn.com/w40/${country_code.toLowerCase()}.png`,
        };
      });

      const favoriteStatusPromises = cityResults.map(async (city) => {
        const response = await fetch(`/api/cities?id=${city.id}`);
        const result = await response.json();
        return { id: city.id, isFavorite: result.isFavorite };
      });

      const favoriteStatuses = await Promise.all(favoriteStatusPromises);
      setResults(cityResults);
      setFavorites(
        favoriteStatuses.reduce((acc, curr) => {
          acc[curr.id] = curr.isFavorite;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); 
    }
  };
  return (
    <>
      <Navbar />
      <Box mt={16} px={4} textAlign="center">
        <Text fontSize="4xl" color="teal" mb={4}>
          Search a City
        </Text>
        <Flex justifyContent="center" mb={8}>
          <Input
            placeholder="Enter city name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown} 
            width="400px"
            mr={4}
          />
          <Button colorScheme="teal" onClick={handleSearch}>
            Search
          </Button>
        </Flex>

        
        {isLoading && <Spinner size="lg" color="teal" />}

        {error && <Text color="red.500">{error}</Text>}

    
        {!isLoading && results.length > 0 && (
          <Box
            as="ol"
            m={0}
            p={4}
            display="inline-block"
            border="1px solid teal"
            borderRadius="md"
            bg="gray.50"
            boxShadow="md"
            listStyleType="decimal"
            listStylePosition="inside"
            width="full"
          >
            {results.map((city) => (
              <Box
                as="li"
                key={city.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={4}
                borderRadius="md"
                bg="gray.100"
                mb={4}
                boxShadow="sm"
                _hover={{
                  bg: "teal.50",
                  borderRadius: "sm",
                }}
              >
             
                <HStack spacing={4} align="center">
                  <Image
                    src={city.flag}
                    alt={`${city.country} flag`}
                    boxSize="20px"
                    objectFit="cover"
                  />
                  <NextLink href={`/city/${city.id}`} passHref>
                    <Link color="teal.500" _hover={{ textDecoration: "underline" }}>
                      {city.name} (Lat: {city.lat}, Lng: {city.lng})
                    </Link>
                  </NextLink>
                </HStack>

               
                <Button
                  colorScheme="teal"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleFavorite(city.id, city.name, city.lat, city.lng)
                  }
                >
                  {favorites[city.id] ? "Remove from Favorite" : "Add to Favorite"}
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
