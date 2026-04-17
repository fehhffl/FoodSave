import { create } from 'zustand';
import { Establishment, Product, Reservation, ConsumerUser, ProfileType } from '../types';
import { establishments as seedEstablishments } from '../data/establishments';
import { products as seedProducts } from '../data/products';
import { seedReservations } from '../data/reservations';
import { consumerUsers } from '../data/users';

interface Toast {
  id: string;
  message: string;
  tone?: 'success' | 'info' | 'warn' | 'danger';
}

interface State {
  // session
  profile: ProfileType | null;
  consumer: ConsumerUser | null;
  establishment: Establishment | null;

  // data
  establishments: Establishment[];
  products: Product[];
  reservations: Reservation[];

  // ui
  toast: Toast | null;

  // actions: auth
  loginConsumer: (email: string, password: string) => boolean;
  loginEstablishment: (email: string, password: string) => boolean;
  logout: () => void;

  // actions: products
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'status'> & { status?: Product['status'] }) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  // actions: reservations
  createReservation: (productId: string, consumerId?: string) => Reservation | null;
  confirmPickup: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;

  // ui
  showToast: (message: string, tone?: Toast['tone']) => void;
  clearToast: () => void;
}

const generateCode = () => {
  const n = 1000 + Math.floor(Math.random() * 9000);
  return `FS · ${n}`;
};

export const useStore = create<State>((set, get) => ({
  profile: null,
  consumer: null,
  establishment: null,

  establishments: seedEstablishments,
  products: seedProducts,
  reservations: seedReservations,
  toast: null,

  loginConsumer: (email, password) => {
    const found = consumerUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return false;
    set({ profile: 'consumer', consumer: found, establishment: null });
    return true;
  },

  loginEstablishment: (email, password) => {
    const found = get().establishments.find(
      (e) => e.email.toLowerCase() === email.toLowerCase() && e.password === password,
    );
    if (!found) return false;
    set({ profile: 'establishment', establishment: found, consumer: null });
    return true;
  },

  logout: () => set({ profile: null, consumer: null, establishment: null }),

  addProduct: (p) => {
    const product: Product = {
      ...p,
      id: `prd_${Date.now()}`,
      status: p.status ?? 'active',
      createdAt: new Date().toISOString(),
    };
    set((s) => ({ products: [product, ...s.products] }));
    return product;
  },

  updateProduct: (id, patch) =>
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  removeProduct: (id) =>
    set((s) => ({ products: s.products.filter((p) => p.id !== id) })),

  createReservation: (productId, consumerId) => {
    const state = get();
    const product = state.products.find((p) => p.id === productId);
    if (!product) return null;
    if (product.quantity < 1) return null;
    const cId = consumerId ?? state.consumer?.id ?? 'usr_lucas';
    const est = state.establishments.find((e) => e.id === product.establishmentId);
    if (!est) return null;

    const now = new Date();
    const pickupFromDate = new Date(product.pickupUntil);
    pickupFromDate.setHours(pickupFromDate.getHours() - 2);

    const sameDay = pickupFromDate.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = pickupFromDate.toDateString() === tomorrow.toDateString();

    const reservation: Reservation = {
      id: `rsv_${Date.now()}`,
      code: generateCode(),
      productId,
      establishmentId: product.establishmentId,
      consumerId: cId,
      productName: product.name,
      establishmentName: est.name,
      establishmentInitial: est.initial,
      thumbVariant: product.thumbVariant,
      price: product.promoPrice,
      originalPrice: product.originalPrice,
      quantity: 1,
      weightKg: product.weightKg,
      pickupFrom: pickupFromDate.toISOString(),
      pickupUntil: product.pickupUntil,
      status: sameDay ? 'today' : isTomorrow ? 'tomorrow' : 'active',
      createdAt: now.toISOString(),
    };

    set((s) => ({
      reservations: [reservation, ...s.reservations],
      products: s.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: p.quantity - 1,
              status: p.quantity - 1 <= 0 ? 'sold' : p.status,
            }
          : p,
      ),
    }));

    return reservation;
  },

  confirmPickup: (reservationId) =>
    set((s) => ({
      reservations: s.reservations.map((r) =>
        r.id === reservationId
          ? { ...r, status: 'completed', completedAt: new Date().toISOString() }
          : r,
      ),
    })),

  cancelReservation: (reservationId) =>
    set((s) => ({
      reservations: s.reservations.map((r) =>
        r.id === reservationId ? { ...r, status: 'cancelled' } : r,
      ),
    })),

  showToast: (message, tone = 'info') =>
    set({ toast: { id: String(Date.now()), message, tone } }),
  clearToast: () => set({ toast: null }),
}));

// Selectors
export const selectActiveReservations = (consumerId?: string) => (s: State) =>
  s.reservations.filter(
    (r) =>
      (!consumerId || r.consumerId === consumerId) &&
      ['active', 'today', 'tomorrow'].includes(r.status),
  );

export const selectHistoryReservations = (consumerId?: string) => (s: State) =>
  s.reservations.filter(
    (r) =>
      (!consumerId || r.consumerId === consumerId) &&
      ['completed', 'cancelled'].includes(r.status),
  );

export const selectCompletedForConsumer = (consumerId?: string) => (s: State) =>
  s.reservations.filter(
    (r) =>
      (!consumerId || r.consumerId === consumerId) && r.status === 'completed',
  );

export const selectReservationsForEstablishment = (estId?: string) => (s: State) =>
  s.reservations.filter((r) => !estId || r.establishmentId === estId);

export const selectProductsForEstablishment = (estId?: string) => (s: State) =>
  s.products.filter((p) => !estId || p.establishmentId === estId);
