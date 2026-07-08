import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";


import {
    Link
} from "react-router-dom";


import {
    useAuth
} from "../context/AuthContext";



const Sidebar = () => {


    const {
        user
    } = useAuth();



    const menuItems =
        user?.role === "MANAGER"

        ?

        [

            {
                text:"Dashboard",
                path:"/manager"
            },

            {
                text:"Projects",
                path:"/manager/projects"
            }

        ]

        :

        [

            {
                text:"Dashboard",
                path:"/member"
            },

            {
                text:"My Reports",
                path:"/member/reports"
            }

        ];



    return (

        <Drawer

            variant="permanent"

            sx={{

                width:240,

                "& .MuiDrawer-paper":{
                    width:240,
                    marginTop:"64px"
                }

            }}

        >

            <List>


                {
                    menuItems.map(item=>(


                        <ListItem
                            key={item.path}
                            disablePadding
                        >

                            <ListItemButton
                                component={Link}
                                to={item.path}
                            >

                                <ListItemText
                                    primary={item.text}
                                />

                            </ListItemButton>


                        </ListItem>


                    ))
                }


            </List>


        </Drawer>

    );


};


export default Sidebar;