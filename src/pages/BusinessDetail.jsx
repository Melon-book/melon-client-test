import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export const BusinessDetail = () => {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [business, setBusiness] = useState(null)
    const [services, setServices] = useState([])
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookingLoading, setBookingLoading] = useState(false)

    // Booking form state
    const [selectedService, setSelectedService] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [clientNotes, setClientNotes] = useState('')

    useEffect(() => {
        console.log('user ', { user });

        fetchBusinessData()
    }, [id])

    const fetchBusinessData = async () => {
        setLoading(true)

        // Fetch business
        const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('*')
            .eq('id', id)
            .single()

        if (businessError) {
            console.error('Error fetching business:', businessError)
            setLoading(false)
            return
        }

        setBusiness(businessData)

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .eq('business_id', id)
            .eq('is_active', true)
            .eq('is_bookable_online', true)

        if (!servicesError) {
            setServices(servicesData || [])
        }

        // Fetch employees
        const { data: employeesData, error: employeesError } = await supabase
            .from('employees')
            .select('*')
            .eq('business_id', id)
            .eq('status', 'active')
            .eq('is_available_for_booking', true)

        if (!employeesError) {
            setEmployees(employeesData || [])
        }

        setLoading(false)
    }

    const handleBooking = async (e) => {
        e.preventDefault()

        console.log('user :', user);


        if (!user) {
            alert('Please login to book an appointment')
            navigate('/login')
            return
        }

        setBookingLoading(true)

        // Find or create client
        const { data: existingClient } = await supabase
            .from('clients')
            .select('*')
            .eq('business_id', id)
            .eq('user_id', user.id)
            .single()

        let clientId = existingClient?.id

        if (!clientId) {
            const { data: newClient, error: clientError } = await supabase
                .from('clients')
                .insert({
                    business_id: id,
                    user_id: user.id,
                    first_name: user.user_metadata?.full_name?.split(' ')[0] || 'Client',
                    last_name: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
                    email: user.email,
                })
                .select()
                .single()

            if (clientError) {
                console.error('Error creating client:', clientError)
                alert('Error creating client profile: ' + clientError.message)
                setBookingLoading(false)
                return
            }

            clientId = newClient.id
        }

        // Get service details
        const service = services.find(s => s.id === selectedService)

        // Calculate end time
        const startTime = selectedTime
        const [hours, minutes] = startTime.split(':').map(Number)
        const endMinutes = hours * 60 + minutes + service.duration_minutes
        const endHours = Math.floor(endMinutes / 60)
        const endMins = endMinutes % 60
        const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}:00`

        // Generate booking reference
        const bookingReference = `BK${Date.now().toString(36).toUpperCase()}`

        // Create appointment
        const { data: appointment, error: appointmentError } = await supabase
            .from('appointments')
            .insert({
                business_id: id,
                client_id: clientId,
                service_id: selectedService,
                employee_id: selectedEmployee || null,
                appointment_date: selectedDate,
                start_time: startTime + ':00',
                end_time: endTime,
                duration_minutes: service.duration_minutes,
                service_price: service.price,
                total_amount: service.price,
                currency: service.currency,
                status: 'scheduled',
                client_notes: clientNotes,
                booking_reference: bookingReference,
                booking_source: 'website',
            })
            .select()
            .single()

        setBookingLoading(false)

        if (appointmentError) {
            console.error('Error creating appointment:', appointmentError)
            alert('Error creating appointment: ' + appointmentError.message)
        } else {
            alert(`Appointment booked successfully! Reference: ${bookingReference}`)
            navigate('/my-appointments')
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="mt-4 text-gray-600">Loading business details...</p>
            </div>
        )
    }

    if (!business) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Business not found</p>
            </div>
        )
    }

    const selectedServiceData = services.find(s => s.id === selectedService)

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Business Info */}
            <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="h-64 bg-gray-200">
                        {business.cover_image_url ? (
                            <img
                                src={business.cover_image_url}
                                alt={business.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {business.name}
                        </h1>
                        <div className="flex items-center mb-4">
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-gray-700 font-medium">
                                {business.average_rating > 0 ? business.average_rating.toFixed(1) : 'New'}
                            </span>
                            <span className="ml-1 text-gray-500">
                                ({business.total_reviews} reviews)
                            </span>
                        </div>
                        {business.description && (
                            <p className="text-gray-600 mb-4">{business.description}</p>
                        )}
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {business.address_line1}, {business.city}
                            </div>
                            {business.phone && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {business.phone}
                                </div>
                            )}
                            {business.email && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {business.email}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Services</h2>
                    {services.length === 0 ? (
                        <p className="text-gray-600">No services available</p>
                    ) : (
                        <div className="space-y-4">
                            {services.map((service) => (
                                <div key={service.id} className="border-b pb-4 last:border-b-0">
                                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                    {service.description && (
                                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                    )}
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-600">
                                            {service.duration_minutes} minutes
                                        </span>
                                        <span className="font-semibold text-purple-600">
                                            {service.price} {service.currency}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Form */}
            <div>
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Book an Appointment</h2>
                    <form onSubmit={handleBooking} className="space-y-4">
                        <div>
                            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Service *
                            </label>
                            <select
                                id="service"
                                required
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Choose a service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - {service.price} {service.currency} ({service.duration_minutes} min)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {employees.length > 0 && (
                            <div>
                                <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Employee (Optional)
                                </label>
                                <select
                                    id="employee"
                                    value={selectedEmployee}
                                    onChange={(e) => setSelectedEmployee(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Any available</option>
                                    {employees.map((employee) => (
                                        <option key={employee.id} value={employee.id}>
                                            {employee.first_name} {employee.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Date *
                            </label>
                            <input
                                id="date"
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Time *
                            </label>
                            <input
                                id="time"
                                type="time"
                                required
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                id="notes"
                                rows="3"
                                value={clientNotes}
                                onChange={(e) => setClientNotes(e.target.value)}
                                placeholder="Any special requests or requirements..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            ></textarea>
                        </div>

                        {selectedServiceData && (
                            <div className="bg-purple-50 p-4 rounded-md">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Service:</span>
                                    <span className="font-medium">{selectedServiceData.name}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Duration:</span>
                                    <span className="font-medium">{selectedServiceData.duration_minutes} min</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span className="text-gray-900">Total:</span>
                                    <span className="text-purple-600">
                                        {selectedServiceData.price} {selectedServiceData.currency}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={bookingLoading || !selectedService || !selectedDate || !selectedTime}
                            className="w-full bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bookingLoading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}