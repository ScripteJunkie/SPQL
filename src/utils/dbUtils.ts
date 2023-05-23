import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  collection,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { UlidMonotonic } from 'id128';

import { UserModel } from './model';

import { db, currentUserId } from './firebase-init';

export async function createUser(
  uid: string,
  email: string,
  firstName: string,
  lastName: string | null,
  phone: string | null,
  employee_id: string | null,
  extra: any | null,
) {
  const user: UserModel = {
    email: email,
    first_name: firstName,
    last_name: lastName || null,
    phone: phone,
    user_id: uid,
    account: {
      type: 'free',
      status: 'active',
      employee_id: employee_id,
    },
    meta: {
      create_date: new Date().toUTCString(),
      update_date: new Date().toUTCString(),
      is_active: true,
    },
    ...extra,
  };

  const ulid = UlidMonotonic.generate();
  await setDoc(doc(db, 'userProfile', ulid.toRaw()), user)
    .then(() => {})
    .catch(e => {
      console.log(e);
    });
}
