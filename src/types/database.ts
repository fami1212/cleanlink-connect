// Manual types until Supabase types are regenerated
export type UserRole = "client" | "provider" | "authority";
export type OrderStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
export type ServiceType = "fosse_septique" | "latrines" | "urgence" | "curage";
export type PaymentMethod = "wave" | "orange_money" | "free_money" | "cash";

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
}

export interface Provider {
  id: string;
  user_id: string;
  company_name: string | null;
  is_online: boolean;
  is_verified: boolean;
  vehicle_type: string | null;
  capacity_liters: number | null;
  rating: number;
  total_missions: number;
  latitude: number | null;
  longitude: number | null;
  license_url: string | null;
  vehicle_registration_url: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  client_id: string;
  provider_id: string | null;
  service_type: ServiceType;
  status: OrderStatus;
  address: string;
  latitude: number | null;
  longitude: number | null;
  price_min: number | null;
  price_max: number | null;
  final_price: number | null;
  payment_method: PaymentMethod | null;
  notes: string | null;
  scheduled_at: string | null;
  accepted_at: string | null;
  completed_at: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface OrderInsert {
  client_id: string;
  service_type: ServiceType;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  payment_method?: PaymentMethod | null;
  notes?: string | null;
  scheduled_at?: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  provider_id: string;
  created_at: string;
}
