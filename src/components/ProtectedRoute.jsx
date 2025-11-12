import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}