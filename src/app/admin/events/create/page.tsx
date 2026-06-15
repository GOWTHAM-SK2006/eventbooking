'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Save,
  Upload,
  Globe
} from 'lucide-react'

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Create New Event</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Fill in the details to create your event
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl p-8"
        >
          <form className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Input
                    id="shortDescription"
                    placeholder="Brief summary of your event"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of your event"
                    rows={5}
                    className="rounded-xl resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select className="w-full h-12 rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4">
                    <option>Conference</option>
                    <option>Workshop</option>
                    <option>Webinar</option>
                    <option>Meetup</option>
                    <option>Concert</option>
                    <option>Sports</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Date & Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date & Time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date & Time</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Venue */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                Venue Details
              </h2>
              
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="isOnline" className="rounded" />
                <Label htmlFor="isOnline" className="cursor-pointer">This is an online event</Label>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue Name</Label>
                  <Input
                    id="venue"
                    placeholder="Enter venue name"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="onlineLink">Online Link (if applicable)</Label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="onlineLink"
                      placeholder="https://..."
                      className="pl-12 h-12 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tickets */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                Ticket Configuration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="totalSeats">Total Seats</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    placeholder="Number of available seats"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price ($)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      className="pl-12 h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-indigo-500" />
                Event Image
              </h2>
              <div className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">Click to upload event banner</p>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 rounded-xl font-semibold" size="lg">
              <Save className="mr-2 h-5 w-5" />
              Create Event
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}