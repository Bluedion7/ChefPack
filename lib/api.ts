import type {
  Meal, Order, Cook, CookOffer, Earning, KitchenVerification,
  Dispute, AdminStats, UserPreferences, Rating,
} from "./types";
import {
  mockMeals, mockOrders, mockCooks, mockOffers, mockEarnings,
  mockVerifications, mockDisputes, mockAdminStats, mockPreferences,
} from "./mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("chefpack_token") : null;
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    const data = await res.json();
    return data.data ?? data;
  } catch {
    throw new Error(`Failed to fetch ${path}`);
  }
}

// ------- Customer APIs -------
export async function getMeals(): Promise<Meal[]> {
  try { return await apiFetch<Meal[]>("/api/v1/menu/meals"); }
  catch { return mockMeals; }
}

export async function getMealById(id: string): Promise<Meal | undefined> {
  try { return await apiFetch<Meal>(`/api/v1/menu/meals/${id}`); }
  catch { return mockMeals.find((m) => m.id === id); }
}

export async function getUserPreferences(): Promise<UserPreferences> {
  try { return await apiFetch<UserPreferences>("/api/v1/users/preferences"); }
  catch { return mockPreferences; }
}

export async function updateUserPreferences(prefs: UserPreferences): Promise<UserPreferences> {
  try {
    return await apiFetch<UserPreferences>("/api/v1/users/preferences", {
      method: "PUT", body: JSON.stringify(prefs),
    });
  } catch { return prefs; }
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  try {
    return await apiFetch<Order>("/api/v1/orders", {
      method: "POST", body: JSON.stringify(order),
    });
  } catch { return { ...mockOrders[0], ...order } as Order; }
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  try { return await apiFetch<Order>(`/api/v1/orders/${id}`); }
  catch { return mockOrders.find((o) => o.id === id); }
}

export async function getOrderTracking(id: string): Promise<Order | undefined> {
  try { return await apiFetch<Order>(`/api/v1/orders/${id}/track`); }
  catch { return mockOrders.find((o) => o.id === id); }
}

export async function submitRating(rating: Rating): Promise<void> {
  try {
    await apiFetch("/api/v1/ratings", { method: "POST", body: JSON.stringify(rating) });
  } catch { /* mock success */ }
}

// ------- Cook APIs -------
export async function getCookProfile(): Promise<Cook> {
  try { return await apiFetch<Cook>("/api/v1/cooks/me"); }
  catch { return mockCooks[0]; }
}

export async function updateKitchen(data: Record<string, unknown>): Promise<void> {
  try {
    await apiFetch("/api/v1/cooks/kitchen", { method: "PUT", body: JSON.stringify(data) });
  } catch { /* mock success */ }
}

export async function getKitchenStatus(): Promise<{ status: string }> {
  try { return await apiFetch<{ status: string }>("/api/v1/cooks/kitchen"); }
  catch { return { status: "PENDING" }; }
}

export async function getCookOffers(): Promise<CookOffer[]> {
  try { return await apiFetch<CookOffer[]>("/api/v1/cooks/offers"); }
  catch { return mockOffers; }
}

export async function acceptOffer(offerId: string): Promise<void> {
  try {
    await apiFetch(`/api/v1/cooks/offers/${offerId}/accept`, { method: "POST" });
  } catch { /* mock success */ }
}

export async function declineOffer(offerId: string): Promise<void> {
  try {
    await apiFetch(`/api/v1/cooks/offers/${offerId}/decline`, { method: "POST" });
  } catch { /* mock success */ }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  try {
    await apiFetch(`/api/v1/cooks/orders/${orderId}/status`, {
      method: "PATCH", body: JSON.stringify({ status }),
    });
  } catch { /* mock success */ }
}

export async function getCookEarnings(): Promise<Earning[]> {
  try { return await apiFetch<Earning[]>("/api/v1/cooks/earnings"); }
  catch { return mockEarnings; }
}

// ------- Admin APIs -------
export async function getAdminStats(): Promise<AdminStats> {
  try { return await apiFetch<AdminStats>("/api/v1/admin/stats"); }
  catch { return mockAdminStats; }
}

export async function getPendingVerifications(): Promise<KitchenVerification[]> {
  try { return await apiFetch<KitchenVerification[]>("/api/v1/admin/kitchen-verifications?status=PENDING"); }
  catch { return mockVerifications; }
}

export async function getVerificationByCookId(cookId: string): Promise<KitchenVerification | undefined> {
  try { return await apiFetch<KitchenVerification>(`/api/v1/admin/kitchen-verifications/${cookId}`); }
  catch { return mockVerifications.find((v) => v.cookId === cookId); }
}

export async function approveKitchen(cookId: string): Promise<void> {
  try {
    await apiFetch(`/api/v1/admin/kitchen-verifications/${cookId}/approve`, { method: "POST" });
  } catch { /* mock success */ }
}

export async function rejectKitchen(cookId: string, reason: string): Promise<void> {
  try {
    await apiFetch(`/api/v1/admin/kitchen-verifications/${cookId}/reject`, {
      method: "POST", body: JSON.stringify({ reason }),
    });
  } catch { /* mock success */ }
}

export async function getAdminOrders(): Promise<Order[]> {
  try { return await apiFetch<Order[]>("/api/v1/admin/orders"); }
  catch { return mockOrders; }
}

export async function getAdminCooks(): Promise<Cook[]> {
  try { return await apiFetch<Cook[]>("/api/v1/admin/cooks"); }
  catch { return mockCooks; }
}

export async function getAdminDisputes(): Promise<Dispute[]> {
  try { return await apiFetch<Dispute[]>("/api/v1/admin/disputes"); }
  catch { return mockDisputes; }
}

export async function getAdminMeals(): Promise<Meal[]> {
  try { return await apiFetch<Meal[]>("/api/v1/admin/menu/meals"); }
  catch { return mockMeals; }
}
