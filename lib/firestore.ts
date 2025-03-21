import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { User } from 'firebase/auth';

export interface InterviewHistory {
  id?: string;
  userId: string;
  title: string;
  date: Date;
  questions: {
    question: string;
    solution: string;
    feedback: string;
  }[];
  difficulty: string;
}

export async function saveInterviewHistory(
  user: User,
  interview: Omit<InterviewHistory, 'id' | 'userId' | 'date'>
) {
  const interviewData: InterviewHistory = {
    ...interview,
    userId: user.uid,
    date: new Date(),
  };

  const docRef = await addDoc(collection(db, 'interviews'), interviewData);
  return { id: docRef.id, ...interviewData };
}

export async function getUserInterviewHistory(user: User): Promise<InterviewHistory[]> {
  const q = query(
    collection(db, 'interviews'),
    where('userId', '==', user.uid),
    orderBy('date', 'desc')
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: (doc.data().date as Timestamp).toDate()
  })) as InterviewHistory[];
} 