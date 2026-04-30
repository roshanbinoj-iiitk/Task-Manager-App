import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

function App() {
	const { user, ready } = useAuth();

	return (
		<div className="min-h-screen bg-slate-50">
			<Navbar />
			<Routes>
				<Route
					path="/login"
					element={
						ready && user ? <Navigate to="/" replace /> : <Login />
					}
				/>
				<Route
					path="/signup"
					element={
						ready && user ? <Navigate to="/" replace /> : <Signup />
					}
				/>
				<Route element={<ProtectedRoute />}> 
					<Route path="/" element={<Dashboard />} />
				</Route>
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
