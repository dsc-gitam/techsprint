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

    // Check if confirmation form is incomplete (no tshirt size or linkedin)
    if (!userData.tshirtSize || !userData.linkedin_profile) {
      return Progress.incompleteRegistration;
    }

    // Check team membership status
    // isTeamMember === -1 means they haven't completed confirmation yet
    if (userData.isTeamMember === -1) {
      return Progress.notYetTeamMember;
    }

    // Check if user is a team lead
    if (userData.isTeamLead === 1) {
      return Progress.completeRegistrationTeamLead;
    }

    // User is a complete team member (isTeamMember === 1)
    if (userData.isTeamMember === 1) {
      return Progress.completeRegistration;
    }

    // User completed confirmation but not in a team yet (isTeamMember === 0)
    // Still allow them to see their profile
    return Progress.completeRegistration;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return Progress.noApplication;
  }
}
