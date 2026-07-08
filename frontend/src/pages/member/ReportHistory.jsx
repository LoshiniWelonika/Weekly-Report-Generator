import {
    useEffect,
    useState
} from "react";


import {
    getMyReports
} from "../../api/reportApi";


import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from "@mui/material";



const ReportHistory = () => {


    const [reports,setReports] = useState([]);



    useEffect(()=>{


        loadReports();


    },[]);



    const loadReports = async()=>{


        try{

            const response =
                await getMyReports();


            setReports(
                response.data.data || response.data
            );


        }
        catch(error){

            console.log(error);

        }


    };



    return (

        <>


        <Typography variant="h4" sx={{mb:3}}>

            My Report History

        </Typography>



        <TableContainer component={Paper}>


            <Table>


                <TableHead>

                    <TableRow>

                        <TableCell>
                            Week Start
                        </TableCell>


                        <TableCell>
                            Week End
                        </TableCell>


                        <TableCell>
                            Project
                        </TableCell>


                        <TableCell>
                            Status
                        </TableCell>


                    </TableRow>


                </TableHead>



                <TableBody>


                {
                    reports.map(report=>(


                        <TableRow key={report._id}>


                            <TableCell>

                                {
                                    new Date(
                                        report.weekStart
                                    )
                                    .toLocaleDateString()
                                }

                            </TableCell>



                            <TableCell>

                                {
                                    new Date(
                                        report.weekEnd
                                    )
                                    .toLocaleDateString()
                                }

                            </TableCell>



                            <TableCell>

                                {
                                    report.project?.name ||
                                    "No Project"
                                }

                            </TableCell>



                            <TableCell>

                                {report.status}

                            </TableCell>


                        </TableRow>


                    ))
                }


                </TableBody>


            </Table>


        </TableContainer>


        </>

    );


};


export default ReportHistory;