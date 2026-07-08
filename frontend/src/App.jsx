import {
    Routes,
    Route
} from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";

import MemberDashboard from "./pages/member/MemberDashboard";

import ManagerDashboard from "./pages/manager/ManagerDashboard";


import ProtectedRoute from "./routes/ProtectedRoute";



function App(){


return (

<Routes>


<Route
    path="/login"
    element={<Login />}
/>



<Route
    path="/register"
    element={<Register />}
/>



<Route

    path="/member"

    element={

        <ProtectedRoute role="MEMBER">

            <MemberDashboard />

        </ProtectedRoute>

    }

/>



<Route

    path="/manager"

    element={

        <ProtectedRoute role="MANAGER">

            <ManagerDashboard />

        </ProtectedRoute>

    }

/>



</Routes>

);


}


export default App;