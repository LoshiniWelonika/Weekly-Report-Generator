import {
    useState
} from "react";


import API from "../api/axios";


import {
    useNavigate
} from "react-router-dom";



const Register = () => {


    const [formData, setFormData] = useState({

        name: "",

        email: "",

        password: "",

        role: "MEMBER"

    });



    const navigate = useNavigate();



    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async(e)=>{


        e.preventDefault();


        try {


            await API.post(
                "/auth/register",
                formData
            );


            alert(
                "Registration successful"
            );


            navigate("/login");


        }
        catch(error){

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        }


    };



    return (

        <form onSubmit={handleSubmit}>


            <h2>
                Register
            </h2>



            <input

                name="name"

                placeholder="Name"

                value={formData.name}

                onChange={handleChange}

            />



            <input

                name="email"

                type="email"

                placeholder="Email"

                value={formData.email}

                onChange={handleChange}

            />



            <input

                name="password"

                type="password"

                placeholder="Password"

                value={formData.password}

                onChange={handleChange}

            />



            <select

                name="role"

                value={formData.role}

                onChange={handleChange}

            >

                <option value="MEMBER">
                    Team Member
                </option>


                <option value="MANAGER">
                    Manager
                </option>


            </select>



            <button>
                Register
            </button>


        </form>

    );


};


export default Register;