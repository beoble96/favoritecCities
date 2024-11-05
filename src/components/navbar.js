import Link from "next/link";
import { Button } from "./ui/button";
import { Flex, Box, Heading, Spacer, ButtonGroup, Group } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Flex gap="4" direction="column" width="100">
<Group gap="2" mb="10" mt="10" >
        <Button  colorPalette="teal"size="xl" variant="ghost"width="40"><Link href="./">Homepage</Link></Button>
        <Button colorPalette="teal"size="xl"variant="ghost"width="40"> <Link href="./cityPage">City page</Link></Button>
        <Button colorPalette="teal"size="xl"variant="ghost"width="40"><Link href="./search">Search</Link></Button>
        <Button colorPalette="teal"size="xl"variant="ghost"width="40"><Link href="./favorites">Favorites</Link></Button>
        </Group>
    </Flex>
  );
}