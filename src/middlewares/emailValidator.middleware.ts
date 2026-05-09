export const isGoogleEmail = (email: string): boolean => {

    const googleRegexEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    return googleRegexEmail.test(email);
}

// Validación con mensaje de error personalizado
export const validateGoogleEmail = (email: string): { isValid: boolean; message?: string } => {
    if (!email || typeof email !== 'string') {
        return { isValid: false, message: 'Email is required' };
    }

    if (!isGoogleEmail(email)) {
        return { isValid: false, message: 'Only Google emails (gmail.com or googlemail.com) are allowed' };
    }

    return { isValid: true };
}