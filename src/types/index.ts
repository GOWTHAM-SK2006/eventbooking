export type UserRole = 'user' | 'admin'

export type User = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type EventCategory = 'conference' | 'workshop' | 'webinar' | 'meetup' | 'concert' | 'sports' | 'other'

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export type Event = {
  id: string
  title: string
  slug: string
  description: string
  short_description: string | null
  category: EventCategory
  status: EventStatus
  start_date: string
  end_date: string
  venue: string
  address: string
  city: string
  state: string | null
  country: string
  latitude: number | null
  longitude: number | null
  image_url: string | null
  total_seats: number
  available_seats: number
  price: number
  currency: string
  organizer_id: string
  is_featured: boolean
  is_online: boolean
  online_link: string | null
  tags: string[]
  created_at: string
  updated_at: string
  organizer?: User
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'attended' | 'waitlist'

export type Booking = {
  id: string
  user_id: string
  event_id: string
  quantity: number
  total_amount: number
  status: BookingStatus
  booking_reference: string
  payment_id: string | null
  created_at: string
  updated_at: string
  event?: Event
  user?: User
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type Payment = {
  id: string
  user_id: string
  booking_id: string
  amount: number
  currency: string
  status: PaymentStatus
  payment_method: string
  transaction_id: string | null
  stripe_session_id: string | null
  created_at: string
  updated_at: string
}

export type TicketStatus = 'valid' | 'used' | 'cancelled'

export type Ticket = {
  id: string
  booking_id: string
  event_id: string
  ticket_code: string
  qr_code: string
  status: TicketStatus
  valid_from: string
  valid_until: string
  created_at: string
  checked_in_at: string | null
}

export type Review = {
  id: string
  user_id: string
  event_id: string
  rating: number
  comment: string | null
  created_at: string
  user?: User
}

export type WishlistItem = {
  id: string
  user_id: string
  event_id: string
  created_at: string
  event?: Event
}

export type Certificate = {
  id: string
  user_id: string
  event_id: string
  certificate_url: string
  issued_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  type: 'booking' | 'reminder' | 'update' | 'payment'
  read: boolean
  created_at: string
}