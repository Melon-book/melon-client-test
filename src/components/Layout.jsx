import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Layout = ({ children }) => {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="text-2xl font-bold text-purple-600">
                                Melon
                            </Link>
                            {user && (
                                <div className="ml-10 flex space-x-4">
                                    <Link
                                        to="/search"
                                        className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Search
                                    </Link>
                                    <Link
                                        to="/my-appointments"
                                        className="text-gray-700 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        My Appointments
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center">
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700 text-sm">{user.email}</span>
                                    <button
                                        onClick={handleSignOut}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-md text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    )
}