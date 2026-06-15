'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Ticket, 
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3
} from 'lucide-react'

const stats = [
  { title: 'Total Events', value: '1,248', change: '+12%', icon: Calendar, color: 'bg-indigo-500' },
  { title: 'Total Users', value: '45,829', change: '+24%', icon: Users, color: 'bg-blue-500' },
  { title: 'Total Bookings', value: '8,542', change: '+18%', icon: Ticket, color: 'bg-cyan-500' },
  { title: 'Total Revenue', value: '$124,580', change: '+32%', icon: DollarSign, color: 'bg-emerald-500' },
]

const events = [
  {
    id: '1',
    title: 'Tech Innovators Summit 2024',
    date: '2024-03-15',
    bookings: 243,
    revenue: '$48,457',
    status: 'published',
  },
  {
    id: '2',
    title: 'Digital Marketing Workshop',
    date: '2024-03-22',
    bookings: 89,
    revenue: '$8,811',
    status: 'published',
  },
  {
    id: '3',
    title: 'AI Conference 2024',
    date: '2024-04-15',
    bookings: 156,
    revenue: '$46,444',
    status: 'draft',
  },
]

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your events and monitor performance
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.color} shadow-lg shadow-${stat.color}/25`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-emerald-500 mt-4">{stat.change} from last month</p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Analytics Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Attendance Analytics</h2>
              <div className="flex items-center gap-2">
                <select className="h-10 rounded-lg border bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-3 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-12 w-12 text-slate-400" />
              <span className="ml-2 text-slate-500">Chart visualization will be here</span>
            </div>
          </Card>
        </motion.div>

        {/* Events Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Events</h2>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>

          <Card className="rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="text-left p-4 font-semibold">Event</th>
                    <th className="text-left p-4 font-semibold">Date</th>
                    <th className="text-left p-4 font-semibold">Bookings</th>
                    <th className="text-left p-4 font-semibold">Revenue</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-right p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                      <td className="p-4 font-medium">{event.title}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{event.bookings}</td>
                      <td className="p-4 font-semibold text-emerald-600">{event.revenue}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          event.status === 'published' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="rounded-lg">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-lg">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-lg text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
</Card>
        </motion.div>
      </div>
    )
}