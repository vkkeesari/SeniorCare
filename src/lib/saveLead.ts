import { signInAnonymously } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export type LeadMessage = { sender: 'user' | 'bot'; text: string };

export async function upsertLeadData(
  sessionId: string,
  extractedFields: Record<string, unknown>,
  latestMessage?: LeadMessage,
) {
  if (!auth || !db) return { saved: false, reason: 'firebase-not-configured' as const };

  const credential = auth.currentUser
    ? { user: auth.currentUser }
    : await signInAnonymously(auth);
  const fields = Object.fromEntries(
    Object.entries(extractedFields).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );

  await setDoc(doc(db, 'leads', sessionId), {
    ...fields,
    sessionId,
    ownerUid: credential.user.uid,
    ...(latestMessage ? { latestMessage: { ...latestMessage, at: serverTimestamp() } } : {}),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return { saved: true as const };
}
