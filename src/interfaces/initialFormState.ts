// Interface for the registration form state
export default interface initialFormState {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  university: string;
  otherUniversity: string;
  coc: number; // 0 or 1
  terms: number; // 0 or 1
}
