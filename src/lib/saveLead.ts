import { signInAnonymously } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { isValidZipCode } from './spokaneServiceArea';

export type LeadFields = {
  moveFor?: string;
  medicalNeeds?: string;
  adls?: string;
  timeline?: string;
  budget?: string;
  name?: string;
  phone?: string;
  email?: string;
  preferredContactMethod?: 'phone' | 'email';
  zip?: string;
  interestedInMoving?: boolean;
};

const requiredTextFields: Array<keyof LeadFields> = [
  'moveFor', 'medicalNeeds', 'adls', 'timeline', 'budget', 'name', 'phone', 'zip',
];

type CompleteLeadFields = LeadFields & Required<Pick<
  LeadFields,
  'moveFor' | 'medicalNeeds' | 'adls' | 'timeline' | 'budget' | 'name' | 'phone' | 'zip' | 'interestedInMoving'
>>;

function isCompleteLead(fields: LeadFields): fields is CompleteLeadFields {
  return requiredTextFields.every(field => {
    const value = fields[field];
    return typeof value === 'string' && value.trim().length > 0;
  }) && typeof fields.interestedInMoving === 'boolean';
}

export async function saveLeadData(
  sessionId: string,
  fields: LeadFields,
) {
  if (!isCompleteLead(fields) || !isValidZipCode(fields.zip)) {
    return { saved: false, reason: 'incomplete-lead' as const };
  }

  if (!auth || !db) return { saved: false, reason: 'firebase-not-configured' as const };

  const credential = auth.currentUser
    ? { user: auth.currentUser }
    : await signInAnonymously(auth);

  await setDoc(doc(db, 'leads', sessionId), {
    sessionId,
    ownerUid: credential.user.uid,
    contactInfo: {
      name: fields.name.trim(),
      phone: fields.phone.trim(),
      email: fields.email?.trim().toLowerCase() || null,
      preferredContactMethod: fields.preferredContactMethod ?? 'phone',
    },
    careDetails: {
      careType: `For ${fields.moveFor.trim()}: ${fields.medicalNeeds.trim()}; daily support: ${fields.adls.trim()}`,
      timeframe: fields.timeline.trim(),
      zipCode: fields.zip.trim(),
      budget: fields.budget.trim(),
    },
    additionalServices: {
      interestedInMoving: fields.interestedInMoving,
    },
    metadata: {
      source: 'web_chat',
      status: 'new',
      createdAt: serverTimestamp(),
    },
  });

  return { saved: true as const };
}
