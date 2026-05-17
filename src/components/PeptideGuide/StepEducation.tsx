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

  // Injectable goals merge safety + administration into the single
  // SafetyChecklist walkthrough — no separate tutorial step. ODT and nasal
  // routes still get their short tutorial panel because that content is unique.
  const hasTutorial =
    content.tutorialSteps.length > 0 ||
    !!content.oralInstructions ||
    !!content.nasalInstructions;

  if (panel === 'safety') {
    return (
      <SafetyChecklist
        content={content}
        onNext={() => (hasTutorial ? setPanel('tutorial') : onComplete())}
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
