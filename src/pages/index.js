import Head from "next/head";
import { BsArrowDownRight } from "react-icons/bs";
import Navbar from "@/components/navbar";
import { Text,Image, AbsoluteCenter, Button, Box,Flex} from "@chakra-ui/react";
import Link from "next/link";
export default function Home() {
  return (
    <>
 
  <Navbar/>
      <Head>
        <title>Favorite Cities</title>
        <meta name="description" content="Favorite Cities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
       
      </Head>
    <Box>
      < AbsoluteCenter axis="horizontal"><Link href="./search"><Text textStyle="7xl" color="teal">Search your favorite city</Text></Link>
      
      </AbsoluteCenter><AbsoluteCenter>
    <Image rounded="md"    height="400px"src="https://arzotravels.com/wp-content/uploads/2016/03/Untitled-design.jpg"  />
    </AbsoluteCenter></Box>

    </>
  );
}
