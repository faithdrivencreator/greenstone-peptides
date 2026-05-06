'use client';

import { useEffect } from 'react';
import { trackViewItem } from '@/lib/gtag';

export default function ViewItemTracker(props: {
  _id: string;
  name: string;
  price: number;
  strength?: string;
  format?: string;
}) {
  useEffect(() => {
    trackViewItem(props);
  }, [props._id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
