import {
    Routes,
    Route
} from "react-router-dom";


import Login from "./pages/Login";
import Register from "./pages/Register";

import MemberDashboard from "./pages/member/MemberDashboard";

import ManagerDashboard from "./pages/manager/ManagerDashboard";

import MainLayout from "./layouts/MainLayout";

import CreateReport from "./pages/member/CreateReport";

import Unauthorized from "./pages/Unauthorized";

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

    <MainLayout>

    <MemberDashboard />

    </MainLayout>

    </ProtectedRoute>

    }
/>


<Route

    path="/manager"

    element={

    <ProtectedRoute role="MANAGER">

    <MainLayout>

    <ManagerDashboard />

    </MainLayout>

    </ProtectedRoute>

    }

/>

<Route

    path="/unauthorized"

    element={<Unauthorized />}

/>

<Route

path="/member/reports/create"

    element={

    <ProtectedRoute role="MEMBER">

    <MainLayout>

    <CreateReport />

    </MainLayout>

    </ProtectedRoute>

    }

/>



</Routes>

);


}


export default App;