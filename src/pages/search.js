import Navbar from "@/components/navbar";
import { Input, Box, Flex, IconButton, Text, Button, AbsoluteCenter } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

export default function Search() {
  return (
    <>
      <Navbar />
      <Box margin="10">
      < AbsoluteCenter axis="horizontal"><Text textStyle="7xl" color="teal">Search a city</Text></AbsoluteCenter>
      </Box>

        <Flex align="center" maxWidth="400px" margin="10" position="absolute" top="30%"left="35%">
        <Box position="relative" flex="1">
         
          <Text
            position="absolute"
            left="1rem"
            top="50%"
            transform="translateY(-50%)"
            color="gray.500"
            fontSize="sm"
            transition="all 0.2s ease"
            pointerEvents="none"
            _focusWithin={{
              top: "-0.75rem",
              fontSize: "xs",
              color: "blue.500",
            }}
          >
            Search city
          </Text>

          <Input
            variant="outline"
            height="50px"        
             width="450px"
             pl="10px"
            paddingY="0"        
            lineHeight="50px"     
            fontSize="md"         
            onFocus={(e) => (e.target.previousSibling.style.top = "-0.75rem")}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.previousSibling.style.top = "50%";
              }
            }}
          />
        </Box>

       
      <Button colorPalette="teal">Search</Button>
      </Flex>
    </>
  );
}
