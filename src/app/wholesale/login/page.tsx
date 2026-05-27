import type { Metadata } from 'next';
import WholesaleLoginForm from './WholesaleLoginForm';

export const metadata: Metadata = {
  title: 'Wholesale Login | GS Wellness Pharmacy',
  description:
    'Access the GS Wellness Pharmacy wholesale portal for authorized distributors and practitioners.',
  alternates: { canonical: '/wholesale/login' },
};

export default function WholesaleLoginPage() {
  return <WholesaleLoginForm />;
}
