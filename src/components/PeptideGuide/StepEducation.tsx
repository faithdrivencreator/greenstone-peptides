'use client';

import { useState } from 'react';
import type { GuideGoal } from '@/lib/guide-logic';
import { GOAL_CONTENT } from '@/data/guide-content';
import { HowItWorks } from './HowItWorks';
import { SafetyChecklist } from './SafetyChecklist';
import { AdminTutorial } from './AdminTutorial';

type EducationPanel = 'how-it-works' | 'safety' | 'tutorial';

interface StepEducationProps {
  goal: GuideGoal;
  onComplete: () => void;
  onBack: () => void;
}

export function StepEducation({ goal, onComplete, onBack }: StepEducationProps) {
  const [panel, setPanel] = useState<EducationPanel>('how-it-works');
  const content = GOAL_CONTENT[goal];

  if (panel === 'how-it-works') {
    return <HowItWorks goal={goal} content={content} onNext={() => setPanel('safety')} />;
  }

  if (panel === 'safety') {
    return (
      <SafetyChecklist
        content={content}
        onNext={() => setPanel('tutorial')}
        onBack={() => setPanel('how-it-works')}
      />
    );
  }

  return (
    <AdminTutorial
      content={content}
      onNext={onComplete}
      onBack={() => setPanel('safety')}
    />
  );
}
