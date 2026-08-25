import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';

const USER_ID = 'kyle';

const hydrationSettingsRef = doc(db, 'users', USER_ID, 'settings', 'hydration');

export async function getDailyGoal() {
  const snapshot = await getDoc(hydrationSettingsRef);

  if (!snapshot.exists()) return 2700;

  const data = snapshot.data();

  return data.dailyGoalMl ?? 2700;
}

export async function saveDailyGoal(goalMl: number) {
  await setDoc(
    hydrationSettingsRef,
    {
      dailyGoalMl: goalMl,
    },
    {
      merge: true,
    },
  );
}
