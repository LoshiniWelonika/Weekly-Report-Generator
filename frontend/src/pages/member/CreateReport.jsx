import {
    useEffect,
    useState
} from "react";


import {
    TextField,
    Button,
    Typography,
    Box,
    MenuItem
} from "@mui/material";


import {
    createReport
} from "../../api/reportApi";


import {
    getProjects
} from "../../api/projectApi";



const CreateReport = () => {


    const [projects,setProjects] = useState([]);



    const [formData,setFormData] = useState({

        weekStart:"",

        weekEnd:"",

        project:"",

        tasksCompleted:"",

        tasksPlanned:"",

        blockers:"",

        hoursWorked:"",

        notes:""

    });



    useEffect(()=>{


        const loadProjects = async()=>{

            try{

                const data = await getProjects();

                setProjects(data);

            }
            catch(error){

                console.log(error);

            }

        };


        loadProjects();


    },[]);




    const handleChange = (e)=>{


        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });


    };




    const handleSubmit = async(e)=>{


        e.preventDefault();


        try{


            const payload = {


                ...formData,


                tasksCompleted:
                    formData.tasksCompleted
                    .split("\n")
                    .filter(task=>task.trim()),



                tasksPlanned:
                    formData.tasksPlanned
                    .split("\n")
                    .filter(task=>task.trim()),



                blockers:
                    formData.blockers
                    .split("\n")
                    .filter(blocker=>blocker.trim()),



                hoursWorked:
                    Number(formData.hoursWorked)


            };



            await createReport(payload);



            alert(
                "Report created successfully"
            );



            setFormData({

                weekStart:"",

                weekEnd:"",

                project:"",

                tasksCompleted:"",

                tasksPlanned:"",

                blockers:"",

                hoursWorked:"",

                notes:""

            });



        }
        catch(error){


            console.log(error);


            alert(
                error.response?.data?.message ||
                "Failed to create report"
            );


        }


    };




    return (

        <Box>


            <Typography variant="h4">

                Create Weekly Report

            </Typography>




            <form onSubmit={handleSubmit}>


                <TextField

                    fullWidth

                    margin="normal"

                    label="Week Start"

                    type="date"

                    name="weekStart"

                    value={formData.weekStart}

                    InputLabelProps={{
                        shrink:true
                    }}

                    onChange={handleChange}

                />




                <TextField

                    fullWidth

                    margin="normal"

                    label="Week End"

                    type="date"

                    name="weekEnd"

                    value={formData.weekEnd}

                    InputLabelProps={{
                        shrink:true
                    }}

                    onChange={handleChange}

                />





                <TextField

                    select

                    fullWidth

                    margin="normal"

                    label="Project"

                    name="project"

                    value={formData.project}

                    onChange={handleChange}

                >


                    {
                        projects.map(project=>(

                            <MenuItem

                                key={project._id}

                                value={project._id}

                            >

                                {project.name}

                            </MenuItem>

                        ))
                    }


                </TextField>





                <TextField

                    fullWidth

                    multiline

                    rows={4}

                    margin="normal"

                    label="Tasks Completed"

                    name="tasksCompleted"

                    value={formData.tasksCompleted}

                    onChange={handleChange}

                />





                <TextField

                    fullWidth

                    multiline

                    rows={4}

                    margin="normal"

                    label="Tasks Planned"

                    name="tasksPlanned"

                    value={formData.tasksPlanned}

                    onChange={handleChange}

                />





                <TextField

                    fullWidth

                    multiline

                    rows={3}

                    margin="normal"

                    label="Blockers"

                    name="blockers"

                    value={formData.blockers}

                    onChange={handleChange}

                />





                <TextField

                    fullWidth

                    margin="normal"

                    label="Hours Worked"

                    name="hoursWorked"

                    type="number"

                    value={formData.hoursWorked}

                    onChange={handleChange}

                />





                <TextField

                    fullWidth

                    multiline

                    margin="normal"

                    label="Notes / Links"

                    name="notes"

                    value={formData.notes}

                    onChange={handleChange}

                />





                <Button

                    type="submit"

                    variant="contained"

                >

                    Save Report

                </Button>



            </form>



        </Box>

    );


};



export default CreateReport;