export type UserRole = "customer" | "cook" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  cookId: string;
  cookName: string;
  cookTier: "cook" | "chef";
  rating: number;
  reviewCount: number;
  dietaryTags: string[];
  allergens: string[];
  prepTime: number;
  servings: number;
  calories?: number;
  category: string;
  available: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  cookId: string;
  cookName: string;
  meals: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip?: number;
  deliveryAddress: string;
  deliveryWindow: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingEvents?: TrackingEvent[];
}

export interface OrderItem {
  mealId: string;
  mealName: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "PICKED_UP"
  | "DELIVERING"
  | "DELIVERED"
  | "CANCELLED";

export interface TrackingEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface Cook {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  tier: "cook" | "chef";
  rating: number;
  reviewCount: number;
  specialties: string[];
  verified: boolean;
  kitchenStatus: KitchenVerificationStatus;
  totalOrders: number;
  joinedAt: string;
}

export type KitchenVerificationStatus =
  | "PENDING"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";

export interface KitchenVerification {
  cookId: string;
  cookName: string;
  cookAvatar: string;
  status: KitchenVerificationStatus;
  submittedAt: string;
  documents: { name: string; url: string; type: string }[];
  kitchenAddress: string;
  kitchenType: string;
  healthCertExpiry?: string;
  notes?: string;
}

export interface CookOffer {
  id: string;
  orderId: string;
  customerName: string;
  meals: OrderItem[];
  deliveryWindow: string;
  total: number;
  tip?: number;
  specialInstructions?: string;
  expiresAt: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
}

export interface Earning {
  id: string;
  orderId: string;
  amount: number;
  tip: number;
  total: number;
  date: string;
  status: "PENDING" | "PAID";
}

export interface Dispute {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  reason: string;
  description: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";
  createdAt: string;
  refundAmount?: number;
}

export interface UserPreferences {
  dietaryRestrictions: string[];
  allergies: string[];
  tastePreferences: {
    spiceLevel: number;
    sweetness: number;
    saltiness: number;
  };
  householdSize: number;
}

export interface Rating {
  orderId: string;
  cookId: string;
  foodQuality: number;
  presentation: number;
  accuracy: number;
  overall: number;
  comment?: string;
  tip?: number;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  activeCooks: number;
  activeCustomers: number;
  pendingVerifications: number;
  openDisputes: number;
  ordersToday: number;
  revenueToday: number;
}

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  recipientEmail: string;
  senderName: string;
  message?: string;
  createdAt: string;
  expiresAt: string;
}
