import {
    Box
} from "@mui/material";


import Navbar from "./Navbar";

import Sidebar from "./Sidebar";



const MainLayout = ({children}) => {


    return (

        <>

            <Navbar />


            <Sidebar />


            <Box

                component="main"

                sx={{

                    marginLeft:"240px",

                    marginTop:"64px",

                    padding:3

                }}

            >

                {children}


            </Box>


        </>


    );


};


export default MainLayout;