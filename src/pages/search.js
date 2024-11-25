import Navbar from "@/components/navbar";
import {
  Box,
  Input,
  Button,
  Text,
  Flex,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import NextLink from "next/link";
import { FiMapPin } from "react-icons/fi"; 
export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResults([]);
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

      const cityResults = data.results.slice(0, 5).map((result) => ({
        id: `${result.geometry.lat},${result.geometry.lng}`,
        name: result.formatted,
        lat: result.geometry.lat,
        lng: result.geometry.lng,
      }));

      setResults(cityResults);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box mt={16} textAlign="center">
        <Text fontSize="4xl" color="teal" mb={4}>
          Search a City
        </Text>
        <Flex justifyContent="center" mb={8}>
          <Input
            placeholder="Enter city name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            width="400px"
            mr={4}
          />
          <Button colorScheme="teal" onClick={handleSearch}>
            Search
          </Button>
        </Flex>
        <Box mt={8}>
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
         
       >
         {results.map((city) => (
           <Box
             as="li"
             key={city.id}
             display="flex"
             alignItems="center"
            
             justifyContent="center" 
           
             gap={2}
             p={2}
             _hover={{
               bg: "teal.100",
               borderRadius: "sm",
             }}
           >
             <FiMapPin color="teal" /> 
             <NextLink href={`/city/${city.name}`} passHref>
               <Link
               center
                 color="teal.500"
                 _hover={{
                   textDecoration: "underline",
                   color: "teal.700",
                   
                 }}
               >
                 {city.name} (Lat: {city.lat}, Lng: {city.lng})
               </Link>
             </NextLink>
           </Box>
         ))}
       </Box>
     )}
        </Box>
      </Box>
    </>
  );
}
