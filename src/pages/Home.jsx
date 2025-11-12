import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Home = () => {
    const { user } = useAuth()

    return (
        <div className="text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold text-gray-900 mb-6">
                    Welcome to Melon
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Book appointments with the best beauty salons and barber shops in Poland
                </p>

                <div className="flex justify-center space-x-4 mb-12">
                    {user ? (
                        <>
                            <Link
                                to="/search"
                                className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors"
                            >
                                Find Businesses
                            </Link>
                            <Link
                                to="/my-appointments"
                                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-50 transition-colors"
                            >
                                My Appointments
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link
                                to="/search"
                                className="bg-white text-purple-600 border-2 border-purple-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-50 transition-colors"
                            >
                                Browse Businesses
                            </Link>
                        </>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Discover
                        </h3>
                        <p className="text-gray-600">
                            Find the best beauty salons and barber shops near you
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Book
                        </h3>
                        <p className="text-gray-600">
                            Schedule appointments online 24/7 with instant confirmation
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Enjoy
                        </h3>
                        <p className="text-gray-600">
                            Get reminders and manage your appointments easily
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}