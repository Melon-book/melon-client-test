import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { BusinessCard } from '../components/BusinessCard'

export const Search = () => {
    const [businesses, setBusinesses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [city, setCity] = useState('')

    useEffect(() => {
        fetchBusinesses()
    }, [])

    const fetchBusinesses = async () => {
        setLoading(true)
        let query = supabase
            .from('businesses')
            .select('*')
            .eq('status', 'approved')
            // .eq('is_active', true)
            .order('average_rating', { ascending: false })

        const { data, error } = await query

        setLoading(false)

        if (error) {
            console.error('Error fetching businesses:', error)
        } else {
            setBusinesses(data || [])
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        setLoading(true)

        let query = supabase
            .from('businesses')
            .select('*')
            .eq('status', 'approved')
            .eq('is_active', true)

        if (searchTerm) {
            query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        }

        if (city) {
            query = query.ilike('city', `%${city}%`)
        }

        query = query.order('average_rating', { ascending: false })

        const { data, error } = await query

        setLoading(false)

        if (error) {
            console.error('Error searching businesses:', error)
        } else {
            setBusinesses(data || [])
        }
    }

    const handleReset = () => {
        setSearchTerm('')
        setCity('')
        fetchBusinesses()
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Find Your Perfect Salon or Barber Shop
                </h1>

                <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Business Name or Service
                            </label>
                            <input
                                id="search"
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="e.g. Hair Salon, Barber"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                id="city"
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="e.g. Warsaw, Krakow"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="flex items-end space-x-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">Loading businesses...</p>
                </div>
            ) : businesses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No businesses found</h3>
                    <p className="mt-1 text-gray-500">Try adjusting your search criteria</p>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600 mb-4">
                        Found {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {businesses.map((business) => (
                            <BusinessCard key={business.id} business={business} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}