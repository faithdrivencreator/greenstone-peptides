import { GuideWizardLoader } from './GuideWizardLoader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Guide — Find Your Protocol | Greenstone Peptides',
  description:
    'Not sure which peptide is right for you? Answer 3 questions and get a personalized protocol recommendation from Greenstone Peptides.',
};

export default function GuidePage() {
  return <GuideWizardLoader />;
}
