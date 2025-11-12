import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { AppointmentCard } from '../components/AppointmentCard'
import { Link } from 'react-router-dom'

export const MyAppointments = () => {
    const { user } = useAuth()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        if (user) {
            fetchAppointments()
        }
    }, [user, filter])

    const fetchAppointments = async () => {
        setLoading(true)

        // First get client ID
        const { data: clientData } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', user.id)

        if (!clientData || clientData.length === 0) {
            setLoading(false)
            setAppointments([])
            return
        }

        const clientIds = clientData.map(c => c.id)

        // Build query
        let query = supabase
            .from('appointments')
            .select(`
        *,
        businesses (
          id,
          name,
          city,
          phone,
          email
        ),
        services (
          id,
          name,
          description
        ),
        employees!appointments_employee_id_fkey (
          id,
          first_name,
          last_name
        )
      `)
            .in('client_id', clientIds)
            .order('appointment_date', { ascending: false })
            .order('start_time', { ascending: false })

        // Apply filter
        if (filter === 'upcoming') {
            query = query.gte('appointment_date', new Date().toISOString().split('T')[0])
                .in('status', ['scheduled', 'confirmed'])
        } else if (filter === 'past') {
            query = query.or(`appointment_date.lt.${new Date().toISOString().split('T')[0]},status.in.(completed,cancelled,no_show)`)
        }

        const { data, error } = await query

        setLoading(false)

        if (error) {
            console.error('Error fetching appointments:', error)
        } else {
            setAppointments(data || [])
        }
    }

    const handleUpdate = () => {
        fetchAppointments()
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    My Appointments
                </h1>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'upcoming'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'past'
                                ? 'bg-purple-600 text-white'
                                : 'text-gray-700 hover:text-purple-600'
                            }`}
                    >
                        Past
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    <p className="mt-4 text-gray-600">Loading appointments...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
                    <p className="mt-1 text-gray-500">
                        {filter === 'upcoming'
                            ? 'You have no upcoming appointments'
                            : filter === 'past'
                                ? 'You have no past appointments'
                                : 'Start booking your first appointment'}
                    </p>
                    <Link
                        to="/search"
                        className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700"
                    >
                        Find Businesses
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {appointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}