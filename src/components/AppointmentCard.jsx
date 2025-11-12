import { useState } from 'react'
import { supabase } from '../lib/supabase'

export const AppointmentCard = ({ appointment, onUpdate }) => {
    const [loading, setLoading] = useState(false)

    const getStatusColor = (status) => {
        const colors = {
            scheduled: 'bg-blue-100 text-blue-800',
            confirmed: 'bg-green-100 text-green-800',
            in_progress: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800',
            no_show: 'bg-red-100 text-red-800',
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pl-PL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const formatTime = (time) => {
        return time.slice(0, 5)
    }

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return
        }

        setLoading(true)
        const { error } = await supabase
            .from('appointments')
            .update({
                status: 'cancelled',
                cancelled_at: new Date().toISOString(),
            })
            .eq('id', appointment.id)

        setLoading(false)

        if (error) {
            alert('Error cancelling appointment: ' + error.message)
        } else {
            onUpdate && onUpdate()
        }
    }

    const canCancel = ['scheduled', 'confirmed'].includes(appointment.status)

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.services?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {appointment.businesses?.name}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {appointment.status.replace('_', ' ').toUpperCase()}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(appointment.appointment_date)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </div>
                {appointment.employees && (
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {appointment.employees.first_name} {appointment.employees.last_name}
                    </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {appointment.total_amount} {appointment.currency}
                </div>
            </div>

            {appointment.client_notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {appointment.client_notes}
                    </p>
                </div>
            )}

            {canCancel && (
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
            )}
        </div>
    )
}