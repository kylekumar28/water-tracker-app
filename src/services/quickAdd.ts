import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';

const USER_ID = 'kyle';

export type QuickAddItem = {
  beverageId: string;
  amountMl: number;
};

const DEFAULT_QUICK_ADD_ITEMS: QuickAddItem[] = [
  {
    beverageId: 'water',
    amountMl: 500,
  },
  {
    beverageId: 'water',
    amountMl: 750,
  },
  {
    beverageId: 'sparkling-water',
    amountMl: 500,
  },
  {
    beverageId: 'coffee',
    amountMl: 250,
  },
];

const quickAddRef = doc(db, 'users', USER_ID, 'settings', 'quickAdd');

export async function seedDefaultQuickAdd() {
  const snapshot = await getDoc(quickAddRef);

  if (snapshot.exists()) {
    return;
  }

  await setDoc(quickAddRef, {
    items: DEFAULT_QUICK_ADD_ITEMS,
  });
}

export async function getQuickAddItems(): Promise<QuickAddItem[]> {
  const snapshot = await getDoc(quickAddRef);

  if (!snapshot.exists()) {
    return DEFAULT_QUICK_ADD_ITEMS;
  }

  const data = snapshot.data();

  return data.items ?? DEFAULT_QUICK_ADD_ITEMS;
}

export async function saveQuickAddItems(items: QuickAddItem[]) {
  await setDoc(
    quickAddRef,
    {
      items,
    },
    {
      merge: true,
    },
  );
}
