import {
    useState
} from "react";


import API from "../api/axios";


import {
    useAuth
} from "../context/AuthContext";


import {
    useNavigate
} from "react-router-dom";



const Login = () => {


    const [email,setEmail] =
        useState("");

    const [password,setPassword] =
        useState("");



    const {
        login
    } = useAuth();



    const navigate =
        useNavigate();



    const handleSubmit = async(e)=>{


        e.preventDefault();


        try{


            const response =
                await API.post(
                    "/auth/login",
                    {
                        email,
                        password
                    }
                );



            login(

                response.data.user,

                response.data.token

            );



            if(
                response.data.user.role === "MANAGER"
            ){

                navigate("/manager");

            }
            else{

                navigate("/member");

            }



        }
        catch(error){

            console.log(error);

        }


    };



    return (

        <form onSubmit={handleSubmit}>


            <h2>
                Login
            </h2>


            <input

                type="email"

                placeholder="Email"

                value={email}

                onChange={
                    e=>setEmail(e.target.value)
                }

            />


            <input

                type="password"

                placeholder="Password"

                value={password}

                onChange={
                    e=>setPassword(e.target.value)
                }

            />


            <button>
                Login
            </button>


        </form>

    );


};


export default Login;