import type { Metadata } from 'next';
import WholesaleLoginForm from './WholesaleLoginForm';

export const metadata: Metadata = {
  title: 'Wholesale Login | Greenstone Wellness',
  description:
    'Access the Greenstone Wellness wholesale portal for authorized distributors and practitioners.',
  alternates: { canonical: '/wholesale/login' },
};

export default function WholesaleLoginPage() {
  return <WholesaleLoginForm />;
}
