export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  category: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  availableSlots: number;
  imageUrl?: string;
  status: string;
  organizerId?: string;
  organizerName?: string;
  venueName?: string;
  venueAddress?: string;
  latitude?: number;
  longitude?: number;
  galleryImages?: string[];
  featured?: boolean;
  faqs?: string;
  termsConditions?: string;
  schedule?: string;
  bookingCount?: number;
  seatSelectionEnabled?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventPrice: number;
  quantity: number;
  totalPrice: number;
  status: string;
  bookingDate: string;
  ticketCodes: string[];
  transactionId?: string;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  status: string;
  seatLabel?: string;
  qrData?: string;
  qrImageBase64?: string;
  checkedInAt?: string;
  bookingId: string;
  eventTitle: string;
  eventDate: string;
  userName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profilePhotoUrl?: string;
  emailVerified: boolean;
  blocked: boolean;
  notificationEmail: boolean;
  notificationPush: boolean;
  notificationReminders: boolean;
  roles: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  recentBookings: Booking[];
  categorySales: Record<string, number>;
  monthlyRevenue: Record<string, number>;
}

export interface CouponValidation {
  valid: boolean;
  message: string;
  discountAmount?: number;
  finalAmount?: number;
  couponCode?: string;
}
