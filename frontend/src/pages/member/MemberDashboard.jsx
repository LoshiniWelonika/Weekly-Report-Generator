import {
    Button,
    Typography
} from "@mui/material";


import {
    Link
} from "react-router-dom";

import {
    getProjects
} from "../../api/projectApi";

const MemberDashboard = () => {


    return (

        <>

            <Typography variant="h4">

                Team Member Dashboard

            </Typography>



            <Button

                variant="contained"

                component={Link}

                to="/member/reports/create"

                sx={{
                    marginTop:2
                }}

            >

                Create Weekly Report

            </Button>


        </>

    );


};


export default MemberDashboard;