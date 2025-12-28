import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

/**
 * Adds or updates data in a Firestore collection
 * @param collectionName - The name of the Firestore collection
 * @param id - The document ID
 * @param data - The data to store
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export default async function addData(
  collectionName: string,
  id: string,
  data: any
): Promise<{ result: any; error: any }> {
  let result = null;
  let error = null;

  try {
    result = await setDoc(doc(db, collectionName, id), data, { merge: true });
  } catch (e) {
    error = e;
    console.error("Error adding document: ", e);
  }

  return { result, error };
}
