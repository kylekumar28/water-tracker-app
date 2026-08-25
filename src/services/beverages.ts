import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { db } from '@/config/firebase';

const USER_ID = 'kyle';

export type Beverage = {
  id: string;
  name: string;
  defaultAmountMl: number;
  presetAmountsMl: number[];
  enabled: boolean;
};

const DEFAULT_BEVERAGES: Beverage[] = [
  {
    id: 'water',
    name: 'Water',
    defaultAmountMl: 500,
    presetAmountsMl: [330, 500, 750, 1000],
    enabled: true,
  },
  {
    id: 'sparkling-water',
    name: 'Sparkling Water',
    defaultAmountMl: 500,
    presetAmountsMl: [500, 1000],
    enabled: true,
  },
  {
    id: 'coffee',
    name: 'Coffee',
    defaultAmountMl: 250,
    presetAmountsMl: [250],
    enabled: true,
  },
];

export async function seedDefaultBeverages() {
  const beveragesRef = collection(db, 'users', USER_ID, 'beverages');

  const snapshot = await getDocs(beveragesRef);

  if (!snapshot.empty) {
    return;
  }

  for (const beverage of DEFAULT_BEVERAGES) {
    const beverageRef = doc(db, 'users', USER_ID, 'beverages', beverage.id);

    await setDoc(beverageRef, {
      name: beverage.name,
      defaultAmountMl: beverage.defaultAmountMl,
      presetAmountsMl: beverage.presetAmountsMl,
      enabled: beverage.enabled,
    });
  }
}

export async function getBeverages(): Promise<Beverage[]> {
  const beveragesRef = collection(db, 'users', USER_ID, 'beverages');

  const snapshot = await getDocs(beveragesRef);

  return snapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
        name: data.name,
        defaultAmountMl: data.defaultAmountMl,
        presetAmountsMl: data.presetAmountsMl ?? [],
        enabled: data.enabled ?? true,
      } satisfies Beverage;
    })
    .filter((beverage) => beverage.enabled);
}
