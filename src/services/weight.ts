import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/config/firebase';

const USER_ID = 'kyle';

export type WeightEntry = {
  id: string;
  weightKg: number;
  createdAt?: Date;
};

const weightRef = collection(db, 'users', USER_ID, 'weightEntries');

export async function addWeightEntry(weightKg: number) {
  const document = await addDoc(weightRef, {
    weightKg,
    createdAt: serverTimestamp(),
  });

  return document.id;
}

export async function getWeightEntries(
  entryLimit = 20,
): Promise<WeightEntry[]> {
  const weightQuery = query(
    weightRef,
    orderBy('createdAt', 'desc'),
    limit(entryLimit),
  );

  const snapshot = await getDocs(weightQuery);

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      weightKg: data.weightKg,
      createdAt: data.createdAt?.toDate?.(),
    };
  });
}
