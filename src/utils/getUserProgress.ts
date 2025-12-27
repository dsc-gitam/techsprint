import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Progress from "./progress";

/**
 * Determines the user's current registration progress
 * @param uid - The user's Firebase Auth UID
 * @returns Promise<Progress> - The user's current progress state
 */
export default async function GetUserProgress(uid: string): Promise<Progress> {
  try {
    const userDocRef = doc(db, "registrations", uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return Progress.noApplication;
    }

    const userData = userDoc.data();

    // Check if payment is pending
    if (!userData.payment_status || userData.payment_status !== "captured") {
      return Progress.paymentPending;
    }

    // Check if registration is complete
    if (!userData.firstName || !userData.lastName || !userData.email) {
      return Progress.incompleteRegistration;
    }

    // Check team membership status
    if (userData.isTeamMember === -1 || userData.isTeamMember === 0) {
      return Progress.notYetTeamMember;
    }

    // Check if user is a team lead
    if (userData.isTeamLead === 1) {
      return Progress.completeRegistrationTeamLead;
    }

    // User is a complete team member
    if (userData.isTeamMember === 1) {
      return Progress.completeRegistration;
    }

    // Default to incomplete
    return Progress.notYetTeamMember;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return Progress.noApplication;
  }
}
