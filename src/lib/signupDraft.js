// Signup form data held in memory between /signup and /verification-code.
// Deliberately NOT in sessionStorage/localStorage: it contains the password.
// A page refresh loses it, and the verification page sends the user back.
let draft = null;

export const setSignupDraft = (data) => { draft = data; };
export const getSignupDraft = () => draft;
export const clearSignupDraft = () => { draft = null; };
