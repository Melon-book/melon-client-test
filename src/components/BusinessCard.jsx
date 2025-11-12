import { Link } from 'react-router-dom'

export const BusinessCard = ({ business }) => {
    return (
        <Link to={`/business/${business.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 overflow-hidden">
                    {business.cover_image_url ? (
                        <img
                            src={business.cover_image_url}
                            alt={business.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {business.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                        {business.city}, {business.country}
                    </p>
                    {business.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {business.description}
                        </p>
                    )}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm text-gray-600">
                                {business.average_rating > 0 ? business.average_rating.toFixed(1) : 'New'}
                            </span>
                            <span className="ml-1 text-sm text-gray-400">
                                ({business.total_reviews})
                            </span>
                        </div>
                        <span className="text-sm font-medium text-purple-600">
                            View Details →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    )
}