import type {
  Meal, Order, Cook, CookOffer, Earning, KitchenVerification,
  Dispute, AdminStats, UserPreferences, GiftCard
} from "./types";

export const mockMeals: Meal[] = [
  {
    id: "meal-1", name: "Jerk Chicken Bowl", description: "Authentic Caribbean jerk chicken served over coconut rice with plantains, black beans, and mango salsa. A Boston favorite!",
    price: 16.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-1", cookName: "Chef Marcus", cookTier: "chef",
    rating: 4.8, reviewCount: 142, dietaryTags: ["Gluten-Free", "High-Protein"], allergens: ["None"],
    prepTime: 35, servings: 1, calories: 680, category: "Caribbean", available: true,
  },
  {
    id: "meal-2", name: "Lobster Mac & Cheese", description: "New England lobster folded into creamy four-cheese pasta, topped with buttery breadcrumbs. Pure comfort food.",
    price: 24.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-2", cookName: "Maria Santos", cookTier: "cook",
    rating: 4.9, reviewCount: 89, dietaryTags: ["Comfort Food"], allergens: ["Dairy", "Gluten", "Shellfish"],
    prepTime: 45, servings: 2, calories: 920, category: "American", available: true,
  },
  {
    id: "meal-3", name: "Thai Basil Stir-Fry", description: "Fresh vegetables and tofu stir-fried with Thai basil, chilies, and garlic in a savory sauce. Served with jasmine rice.",
    price: 14.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-3", cookName: "Lin Chen", cookTier: "cook",
    rating: 4.7, reviewCount: 203, dietaryTags: ["Vegan", "Dairy-Free"], allergens: ["Soy"],
    prepTime: 20, servings: 1, calories: 420, category: "Thai", available: true,
  },
  {
    id: "meal-4", name: "Lamb Tagine", description: "Slow-cooked Moroccan lamb with apricots, almonds, and warm spices. Served with fluffy couscous and harissa.",
    price: 22.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-1", cookName: "Chef Marcus", cookTier: "chef",
    rating: 4.6, reviewCount: 67, dietaryTags: ["Gluten-Free", "High-Protein"], allergens: ["Tree Nuts"],
    prepTime: 60, servings: 2, calories: 750, category: "Moroccan", available: true,
  },
  {
    id: "meal-5", name: "Pesto Salmon Bowl", description: "Pan-seared Atlantic salmon with house-made basil pesto, roasted vegetables, and quinoa.",
    price: 19.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-4", cookName: "Sofia Romano", cookTier: "chef",
    rating: 4.9, reviewCount: 156, dietaryTags: ["Gluten-Free", "High-Protein", "Omega-3"], allergens: ["Fish", "Tree Nuts"],
    prepTime: 30, servings: 1, calories: 580, category: "Mediterranean", available: true,
  },
  {
    id: "meal-6", name: "BBQ Pulled Pork Tacos", description: "Slow-smoked pulled pork with tangy slaw, pickled onions, and chipotle crema on corn tortillas.",
    price: 13.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-5", cookName: "James Wright", cookTier: "cook",
    rating: 4.5, reviewCount: 98, dietaryTags: ["Gluten-Free"], allergens: ["Dairy"],
    prepTime: 25, servings: 1, calories: 520, category: "Mexican", available: true,
  },
  {
    id: "meal-7", name: "Mushroom Risotto", description: "Creamy arborio rice with wild mushrooms, truffle oil, and parmesan. A vegetarian delight.",
    price: 17.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-4", cookName: "Sofia Romano", cookTier: "chef",
    rating: 4.8, reviewCount: 112, dietaryTags: ["Vegetarian"], allergens: ["Dairy"],
    prepTime: 40, servings: 1, calories: 620, category: "Italian", available: true,
  },
  {
    id: "meal-8", name: "Chicken Tikka Masala", description: "Tender chicken in a rich, aromatic tomato-cream sauce with basmati rice and garlic naan.",
    price: 15.99, image: "/placeholder.svg?height=400&width=600", cookId: "cook-6", cookName: "Priya Patel", cookTier: "cook",
    rating: 4.7, reviewCount: 178, dietaryTags: ["High-Protein"], allergens: ["Dairy", "Gluten"],
    prepTime: 35, servings: 1, calories: 710, category: "Indian", available: true,
  },
];

export const mockOrders: Order[] = [
  {
    id: "ord-1001", customerId: "user-1", cookId: "cook-1", cookName: "Chef Marcus",
    meals: [{ mealId: "meal-1", mealName: "Jerk Chicken Bowl", quantity: 2, price: 16.99 }],
    status: "DELIVERING", total: 41.47, subtotal: 33.98, deliveryFee: 4.99, serviceFee: 2.50,
    deliveryAddress: "123 Beacon St, Boston, MA 02116", deliveryWindow: "6:00 PM - 6:30 PM",
    createdAt: "2026-02-13T14:00:00Z", updatedAt: "2026-02-13T17:30:00Z", estimatedDelivery: "6:15 PM",
    trackingEvents: [
      { status: "PENDING", timestamp: "2026-02-13T14:00:00Z", description: "Order placed" },
      { status: "CONFIRMED", timestamp: "2026-02-13T14:05:00Z", description: "Cook confirmed your order" },
      { status: "PREPARING", timestamp: "2026-02-13T16:30:00Z", description: "Your meal is being prepared" },
      { status: "READY", timestamp: "2026-02-13T17:10:00Z", description: "Meal is ready for pickup" },
      { status: "PICKED_UP", timestamp: "2026-02-13T17:20:00Z", description: "Courier picked up your order" },
      { status: "DELIVERING", timestamp: "2026-02-13T17:30:00Z", description: "On the way to you" },
    ],
  },
  {
    id: "ord-1002", customerId: "user-1", cookId: "cook-4", cookName: "Sofia Romano",
    meals: [
      { mealId: "meal-5", mealName: "Pesto Salmon Bowl", quantity: 1, price: 19.99 },
      { mealId: "meal-7", mealName: "Mushroom Risotto", quantity: 1, price: 17.99 },
    ],
    status: "DELIVERED", total: 50.47, subtotal: 37.98, deliveryFee: 4.99, serviceFee: 2.50, tip: 5.00,
    deliveryAddress: "123 Beacon St, Boston, MA 02116", deliveryWindow: "7:00 PM - 7:30 PM",
    createdAt: "2026-02-12T12:00:00Z", updatedAt: "2026-02-12T19:15:00Z",
    trackingEvents: [
      { status: "PENDING", timestamp: "2026-02-12T12:00:00Z", description: "Order placed" },
      { status: "DELIVERED", timestamp: "2026-02-12T19:15:00Z", description: "Delivered" },
    ],
  },
  {
    id: "ord-1003", customerId: "user-2", cookId: "cook-3", cookName: "Lin Chen",
    meals: [{ mealId: "meal-3", mealName: "Thai Basil Stir-Fry", quantity: 3, price: 14.99 }],
    status: "PREPARING", total: 52.46, subtotal: 44.97, deliveryFee: 4.99, serviceFee: 2.50,
    deliveryAddress: "456 Commonwealth Ave, Boston, MA 02215", deliveryWindow: "12:00 PM - 12:30 PM",
    createdAt: "2026-02-13T10:00:00Z", updatedAt: "2026-02-13T11:30:00Z",
    trackingEvents: [
      { status: "PENDING", timestamp: "2026-02-13T10:00:00Z", description: "Order placed" },
      { status: "CONFIRMED", timestamp: "2026-02-13T10:05:00Z", description: "Cook confirmed" },
      { status: "PREPARING", timestamp: "2026-02-13T11:30:00Z", description: "Being prepared" },
    ],
  },
];

export const mockCooks: Cook[] = [
  { id: "cook-1", name: "Chef Marcus", bio: "Caribbean & fusion cuisine specialist with 15 years of experience. Trained at Le Cordon Bleu.", avatar: "/placeholder.svg?height=100&width=100", tier: "chef", rating: 4.8, reviewCount: 209, specialties: ["Caribbean", "Fusion", "Moroccan"], verified: true, kitchenStatus: "APPROVED", totalOrders: 523, joinedAt: "2025-03-15T00:00:00Z" },
  { id: "cook-2", name: "Maria Santos", bio: "New England comfort food with a Portuguese twist. Born and raised in Boston.", avatar: "/placeholder.svg?height=100&width=100", tier: "cook", rating: 4.9, reviewCount: 89, specialties: ["American", "Portuguese", "Seafood"], verified: true, kitchenStatus: "APPROVED", totalOrders: 187, joinedAt: "2025-06-01T00:00:00Z" },
  { id: "cook-3", name: "Lin Chen", bio: "Authentic Southeast Asian cuisine. Specializing in Thai and Vietnamese flavors.", avatar: "/placeholder.svg?height=100&width=100", tier: "cook", rating: 4.7, reviewCount: 203, specialties: ["Thai", "Vietnamese", "Asian Fusion"], verified: true, kitchenStatus: "APPROVED", totalOrders: 412, joinedAt: "2025-01-10T00:00:00Z" },
  { id: "cook-4", name: "Sofia Romano", bio: "Italian and Mediterranean cooking. Farm-to-table philosophy with seasonal ingredients.", avatar: "/placeholder.svg?height=100&width=100", tier: "chef", rating: 4.9, reviewCount: 268, specialties: ["Italian", "Mediterranean", "Farm-to-Table"], verified: true, kitchenStatus: "APPROVED", totalOrders: 634, joinedAt: "2024-11-20T00:00:00Z" },
  { id: "cook-5", name: "James Wright", bio: "BBQ and Southern comfort food. Slow-smoked meats and classic sides.", avatar: "/placeholder.svg?height=100&width=100", tier: "cook", rating: 4.5, reviewCount: 98, specialties: ["BBQ", "Southern", "Mexican"], verified: true, kitchenStatus: "APPROVED", totalOrders: 201, joinedAt: "2025-08-05T00:00:00Z" },
  { id: "cook-6", name: "Priya Patel", bio: "Traditional Indian cuisine with modern presentation. Family recipes passed down generations.", avatar: "/placeholder.svg?height=100&width=100", tier: "cook", rating: 4.7, reviewCount: 178, specialties: ["Indian", "Vegetarian", "Vegan"], verified: false, kitchenStatus: "SUBMITTED", totalOrders: 0, joinedAt: "2026-01-15T00:00:00Z" },
];

export const mockOffers: CookOffer[] = [
  { id: "offer-1", orderId: "ord-2001", customerName: "Sarah J.", meals: [{ mealId: "meal-1", mealName: "Jerk Chicken Bowl", quantity: 2, price: 16.99 }], deliveryWindow: "6:00 PM - 6:30 PM", total: 33.98, tip: 5.00, specialInstructions: "Extra spicy please!", expiresAt: "2026-02-13T15:00:00Z", status: "PENDING" },
  { id: "offer-2", orderId: "ord-2002", customerName: "Mike T.", meals: [{ mealId: "meal-4", mealName: "Lamb Tagine", quantity: 1, price: 22.99 }], deliveryWindow: "7:00 PM - 7:30 PM", total: 22.99, expiresAt: "2026-02-13T16:00:00Z", status: "PENDING" },
];

export const mockEarnings: Earning[] = [
  { id: "earn-1", orderId: "ord-1001", amount: 28.00, tip: 5.00, total: 33.00, date: "2026-02-13", status: "PENDING" },
  { id: "earn-2", orderId: "ord-1002", amount: 32.00, tip: 8.00, total: 40.00, date: "2026-02-12", status: "PAID" },
  { id: "earn-3", orderId: "ord-0998", amount: 18.00, tip: 3.00, total: 21.00, date: "2026-02-11", status: "PAID" },
  { id: "earn-4", orderId: "ord-0995", amount: 45.00, tip: 10.00, total: 55.00, date: "2026-02-10", status: "PAID" },
  { id: "earn-5", orderId: "ord-0990", amount: 22.00, tip: 4.00, total: 26.00, date: "2026-02-09", status: "PAID" },
];

export const mockVerifications: KitchenVerification[] = [
  { cookId: "cook-6", cookName: "Priya Patel", cookAvatar: "/placeholder.svg?height=100&width=100", status: "SUBMITTED", submittedAt: "2026-02-10T09:00:00Z", documents: [{ name: "Health Certificate", url: "#", type: "pdf" }, { name: "Kitchen Photos", url: "#", type: "image" }, { name: "Food Handler License", url: "#", type: "pdf" }], kitchenAddress: "789 Huntington Ave, Boston, MA 02115", kitchenType: "Home Kitchen", healthCertExpiry: "2027-02-10" },
  { cookId: "cook-7", cookName: "Alex Kim", cookAvatar: "/placeholder.svg?height=100&width=100", status: "UNDER_REVIEW", submittedAt: "2026-02-08T14:00:00Z", documents: [{ name: "Health Certificate", url: "#", type: "pdf" }, { name: "Kitchen Photos", url: "#", type: "image" }], kitchenAddress: "321 Boylston St, Boston, MA 02116", kitchenType: "Commercial Kitchen", healthCertExpiry: "2027-06-15", notes: "Shared commercial space" },
];

export const mockDisputes: Dispute[] = [
  { id: "disp-1", orderId: "ord-0980", customerId: "user-5", customerName: "Emily R.", reason: "Missing items", description: "Order was missing the side of rice and the mango salsa.", status: "OPEN", createdAt: "2026-02-12T20:00:00Z", refundAmount: 5.99 },
  { id: "disp-2", orderId: "ord-0975", customerId: "user-8", customerName: "David L.", reason: "Food quality", description: "The chicken was undercooked and the sauce was too salty.", status: "INVESTIGATING", createdAt: "2026-02-11T18:30:00Z", refundAmount: 16.99 },
  { id: "disp-3", orderId: "ord-0960", customerId: "user-3", customerName: "Rachel K.", reason: "Late delivery", description: "Order arrived 45 minutes after the delivery window.", status: "RESOLVED", createdAt: "2026-02-10T21:00:00Z", refundAmount: 4.99 },
];

export const mockAdminStats: AdminStats = {
  totalOrders: 2847, totalRevenue: 68420.50, activeCooks: 24, activeCustomers: 1203,
  pendingVerifications: 2, openDisputes: 2, ordersToday: 47, revenueToday: 1234.50,
};

export const mockPreferences: UserPreferences = {
  dietaryRestrictions: ["Gluten-Free"], allergies: ["Shellfish"], tastePreferences: { spiceLevel: 3, sweetness: 2, saltiness: 3 }, householdSize: 2,
};

export const mockGiftCards: GiftCard[] = [
  { id: "gc-1", code: "CHEF-ABCD-1234", amount: 50, balance: 35.50, recipientEmail: "friend@email.com", senderName: "You", message: "Enjoy some great food!", createdAt: "2026-01-15T00:00:00Z", expiresAt: "2027-01-15T00:00:00Z" },
];
