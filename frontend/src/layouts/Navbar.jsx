import {
    AppBar,
    Toolbar,
    Typography,
    Button
} from "@mui/material";


import {
    useAuth
} from "../context/AuthContext";


const Navbar = () => {


    const {
        user,
        logout
    } = useAuth();



    return (

        <AppBar position="fixed">

            <Toolbar>


                <Typography
                    variant="h6"
                    sx={{
                        flexGrow:1
                    }}
                >

                    Weekly Report Generator

                </Typography>



                {
                    user && (

                        <>

                        <Typography
                            sx={{
                                marginRight:2
                            }}
                        >

                            {user.name}

                        </Typography>


                        <Button

                            color="inherit"

                            onClick={logout}

                        >

                            Logout

                        </Button>

                        </>

                    )
                }


            </Toolbar>

        </AppBar>

    );


};


export default Navbar;