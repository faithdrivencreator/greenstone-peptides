import 'next-auth';
import 'next-auth/jwt';

export interface ShippingAddress {
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      shippingState?: string | null;
      shippingAddress?: ShippingAddress | null;
      phone?: string | null;
      dateOfBirth?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    shippingState?: string | null;
    shippingAddress?: ShippingAddress | null;
    phone?: string | null;
    dateOfBirth?: string | null;
  }
}
