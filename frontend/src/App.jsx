import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import MemberDashboard from "./pages/member/MemberDashboard";
import WeeklyReportForm from "./pages/member/WeeklyReportForm";
import ReportHistory from "./pages/member/ReportHistory";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerReports from "./pages/manager/Reports";
import ManagerProjects from "./pages/manager/Projects";
import ProtectedRoute from "./routes/ProtectedRoute";

const HomeRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Navigate to={user.role === "MANAGER" ? "/manager" : "/member"} replace />;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

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
                path="/member/reports"
                element={
                    <ProtectedRoute role="MEMBER">
                        <MainLayout>
                            <ReportHistory />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/member/reports/create"
                element={
                    <ProtectedRoute role="MEMBER">
                        <MainLayout>
                            <WeeklyReportForm />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/member/reports/:id/edit"
                element={
                    <ProtectedRoute role="MEMBER">
                        <MainLayout>
                            <WeeklyReportForm />
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
                path="/manager/reports"
                element={
                    <ProtectedRoute role="MANAGER">
                        <MainLayout>
                            <ManagerReports />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/manager/projects"
                element={
                    <ProtectedRoute role="MANAGER">
                        <MainLayout>
                            <ManagerProjects />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;