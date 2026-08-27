import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/config/firebase';

const USER_ID = 'kyle';

export type Drink = {
  id: string;
  name: string;
  beverageId: string;
  amount: number;
  createdAt?: Date;
  healthKitWaterSampleId?: string;
  healthKitCaffeineSampleId?: string;
};

export async function addDrink(
  beverageId: string,
  name: string,
  amount: number,
) {
  const drinksRef = collection(db, 'users', USER_ID, 'drinks');

  const docRef = await addDoc(drinksRef, {
    beverageId,
    name,
    amountMl: amount,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function saveHealthKitSampleIds(
  id: string,
  waterSampleId?: string,
  caffeineSampleId?: string,
) {
  const drinkRef = doc(db, 'users', USER_ID, 'drinks', id);

  await updateDoc(drinkRef, {
    ...(waterSampleId && {
      healthKitWaterSampleId: waterSampleId,
    }),

    ...(caffeineSampleId && {
      healthKitCaffeineSampleId: caffeineSampleId,
    }),
  });
}

async function getDrinksBetween(
  startDate: Date,
  endDate: Date,
): Promise<Drink[]> {
  const drinksRef = collection(db, 'users', USER_ID, 'drinks');

  const drinksQuery = query(
    drinksRef,
    where('createdAt', '>=', startDate),
    where('createdAt', '<', endDate),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(drinksQuery);

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      beverageId: data.beverageId,
      name: data.name,
      amount: data.amountMl,
      createdAt: data.createdAt?.toDate?.(),
      healthKitWaterSampleId: data.healthKitWaterSampleId,
      healthKitCaffeineSampleId: data.healthKitCaffeineSampleId,
    };
  });
}

export async function getDrinks() {
  const startOfToday = new Date();

  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);

  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  return getDrinksBetween(startOfToday, startOfTomorrow);
}

export async function getDrinksForDate(date: Date) {
  const startOfDay = new Date(date);

  startOfDay.setHours(0, 0, 0, 0);

  const startOfNextDay = new Date(startOfDay);

  startOfNextDay.setDate(startOfNextDay.getDate() + 1);

  return getDrinksBetween(startOfDay, startOfNextDay);
}

export async function getDrinksForRange(startDate: Date, endDate: Date) {
  return getDrinksBetween(startDate, endDate);
}

export async function removeDrink(id: string) {
  const drinksRef = doc(db, 'users', USER_ID, 'drinks', id);

  await deleteDoc(drinksRef);
}
