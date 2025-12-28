// Interface for the registration form state
export default interface initialFormState {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  socialProfile: string;
  linkedin_profile: string;
  github_profile: string;
  university: string;
  otherUniversity: string;
  accommodation: number; // 0 or 1
  tshirtSize: string;
  coc: number; // 0 or 1
  terms: number; // 0 or 1
}
