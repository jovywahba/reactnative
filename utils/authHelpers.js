import { db } from '../firebaseClient';
import { collection, query, where, getDocs } from 'firebase/firestore';

export async function resolveEmailFromInput(loginId) {
  const id = (loginId || '').trim().toLowerCase();
  if (!id) return null;
  if (id.includes('@')) return id;

  const q = query(collection(db, 'users'), where('username', '==', id));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return (snap.docs[0].data().email || '').toLowerCase();
}
