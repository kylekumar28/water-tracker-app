import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';

const USER_ID = 'kyle';

export type DailySummary = {
  dateKey: string;
  goalMl: number;
};

function getDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export async function getDailySummary(
  date: Date,
): Promise<DailySummary | null> {
  const dateKey = getDateKey(date);

  const summaryRef = doc(db, 'users', USER_ID, 'dailySummaries', dateKey);

  const snapshot = await getDoc(summaryRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    dateKey,
    goalMl: data.goalMl,
  };
}

export async function ensureDailySummary(
  date: Date,
  goalMl: number,
): Promise<DailySummary> {
  const dateKey = getDateKey(date);

  const summaryRef = doc(db, 'users', USER_ID, 'dailySummaries', dateKey);

  const snapshot = await getDoc(summaryRef);

  if (snapshot.exists()) {
    const data = snapshot.data();

    return {
      dateKey,
      goalMl: data.goalMl,
    };
  }

  await setDoc(summaryRef, {
    dateKey,
    goalMl,
  });

  return {
    dateKey,
    goalMl,
  };
}

export async function updateDailySummaryGoal(date: Date, goalMl: number) {
  const dateKey = getDateKey(date);

  const summaryRef = doc(db, 'users', USER_ID, 'dailySummaries', dateKey);

  await setDoc(
    summaryRef,
    {
      dateKey,
      goalMl,
    },
    {
      merge: true,
    },
  );
}
