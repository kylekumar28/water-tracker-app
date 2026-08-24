import { db } from '@/config/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

const USER_ID = 'kyle';

export type Drink = {
  id: string;
  name: string;
  amount: number;
  createdAt?: Date;
};

export async function addDrink(amount: number) {
  const drinksRef = collection(db, 'users', USER_ID, 'drinks');

  const docRef = await addDoc(drinksRef, {
    type: 'water',
    name: 'Water',
    amountMl: amount,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getDrinks() {
  const drinksRef = collection(db, 'users', USER_ID, 'drinks');

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

  const drinksQuery = query(
    drinksRef,
    where('createdAt', '>=', startOfToday),
    where('createdAt', '<', startOfTomorrow),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(drinksQuery);

  return snapshot.docs.map((document) => {
    const data = document.data();

    return {
      id: document.id,
      name: data.name,
      amount: data.amountMl,
      createdAt: data.createdAt?.toDate?.(),
    };
  });
}

export async function removeDrink(id: string) {
  const drinksRef = doc(db, 'users', USER_ID, 'drinks', id);

  await deleteDoc(drinksRef);
}
