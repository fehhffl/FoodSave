export type ProfileType = 'consumer' | 'establishment';

export type ProductCategory =
  | 'pizza'
  | 'padaria'
  | 'marmita'
  | 'mercado'
  | 'hortifruti'
  | 'laticinios'
  | 'doces'
  | 'bebidas';

export type EstablishmentType = 'restaurante' | 'padaria' | 'mercado' | 'hortifruti' | 'bistro';

export interface Establishment {
  id: string;
  name: string;
  initial: string;
  type: EstablishmentType;
  address: string;
  city: string;
  distanceKm: number;
  rating: number;
  thumbVariant: 'pizza' | 'bread' | 'meal' | 'sage' | 'amber' | 'forest';
  // login (for establishment profile)
  email: string;
  password: string;
  // map coordinates (relative %)
  mapX: number;
  mapY: number;
}

export interface Product {
  id: string;
  establishmentId: string;
  name: string;
  italicWord?: string; // word to render in italic in headlines
  description: string;
  category: ProductCategory;
  originalPrice: number;
  promoPrice: number;
  quantity: number;
  pickupUntil: string; // ISO datetime
  validUntil: string;
  weightKg: number; // food saved per unit
  thumbVariant: 'pizza' | 'bread' | 'meal' | 'sage' | 'amber' | 'forest' | 'neutral';
  status: 'active' | 'paused' | 'sold' | 'expired';
  createdAt: string;
}

export type ReservationStatus = 'active' | 'today' | 'tomorrow' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  code: string; // FS · XXXX
  productId: string;
  establishmentId: string;
  consumerId: string;
  productName: string;
  establishmentName: string;
  establishmentInitial: string;
  thumbVariant: Product['thumbVariant'];
  price: number;
  originalPrice: number;
  quantity: number;
  weightKg: number;
  pickupFrom: string;
  pickupUntil: string;
  status: ReservationStatus;
  createdAt: string;
  completedAt?: string;
}

export interface ConsumerUser {
  id: string;
  name: string;
  email: string;
  password: string;
  city: string;
  joinedAt: string;
}

export interface Toast {
  id: string;
  message: string;
  tone?: 'success' | 'info' | 'warn' | 'danger';
}
