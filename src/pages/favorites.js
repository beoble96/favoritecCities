import Navbar from "@/components/navbar";
import { Text, AbsoluteCenter} from "@chakra-ui/react";
export default function Home() {
  return (
    <>
 
  <Navbar/>
     
     
  < AbsoluteCenter axis="horizontal"><Text textStyle="7xl" color="teal" alignItems="center">Favorite cities</Text></AbsoluteCenter>

        
    </>
  );
}