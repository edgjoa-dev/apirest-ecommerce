export interface PasswordValidationResult {
    isValid: boolean;
    message?: string;
    details?: {
        hasUppercase?: boolean;
        hasLowercase?: boolean;
        hasNumbers?: boolean;
        hasSpecialChar?: boolean;
        uppercaseCount?: number;
        lowercaseCount?: number;
        numberCount?: number;
        specialCharCount?: number;
    };
}

// Función para sanitizar y prevenir XSS
const sanitizePassword = (password: string): { sanitized: string; hasDangerousChars: boolean } => {
    // Caracteres peligrosos que pueden causar XSS o inyección
    const dangerousChars = /[<>'"/;`%]/g;

    if (dangerousChars.test(password)) {
        return { sanitized: '', hasDangerousChars: true };
    }

    // Eliminar caracteres de control y espacios extremos
    const sanitized = password.replace(/[\x00-\x1F\x7F]/g, '');

    return { sanitized, hasDangerousChars: false };
};



// Función principal de validación
export const validatePassword = (password: string): PasswordValidationResult => {
    // Validar que existe
    if (!password || typeof password !== 'string') {
        return {
            isValid: false,
            message: 'Password is required'
        };
    }

    // Sanitizar y verificar caracteres peligrosos
    const { sanitized, hasDangerousChars } = sanitizePassword(password);

    if (hasDangerousChars) {
        return {
            isValid: false,
            message: 'Password contains invalid or dangerous characters'
        };
    }

    // Contar caracteres
    let uppercaseCount = 0;
    let lowercaseCount = 0;
    let numberCount = 0;
    let specialCharCount = 0;

    // Caracteres especiales permitidos (seguros)
    const allowedSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

    for (const char of sanitized) {
        if (/[A-Z]/.test(char)) {
            uppercaseCount++;
        } else if (/[a-z]/.test(char)) {
            lowercaseCount++;
        } else if (/[0-9]/.test(char)) {
            numberCount++;
        } else if (allowedSpecialChars.test(char)) {
            specialCharCount++;
        } else if (char !== ' ' && char !== '\t') {
            // Caracter no permitido
            return {
                isValid: false,
                message: 'Password contains invalid characters',
                details: {
                    hasUppercase: uppercaseCount >= 3,
                    hasLowercase: lowercaseCount >= 3,
                    hasNumbers: numberCount >= 3,
                    hasSpecialChar: specialCharCount >= 1,
                    uppercaseCount,
                    lowercaseCount,
                    numberCount,
                    specialCharCount
                }
            };
        }
    }

    // Validar requisitos mínimos
    if (uppercaseCount < 3) {
        return {
            isValid: false,
            message: `Password must contain at least 3 uppercase letters (current: ${uppercaseCount})`,
            details: {
                hasUppercase: false,
                hasLowercase: lowercaseCount >= 3,
                hasNumbers: numberCount >= 3,
                hasSpecialChar: specialCharCount >= 1,
                uppercaseCount,
                lowercaseCount,
                numberCount,
                specialCharCount
            }
        };
    }

    if (lowercaseCount < 3) {
        return {
            isValid: false,
            message: `Password must contain at least 3 lowercase letters (current: ${lowercaseCount})`,
            details: {
                hasUppercase: true,
                hasLowercase: false,
                hasNumbers: numberCount >= 3,
                hasSpecialChar: specialCharCount >= 1,
                uppercaseCount,
                lowercaseCount,
                numberCount,
                specialCharCount
            }
        };
    }

    if (numberCount < 3) {
        return {
            isValid: false,
            message: `Password must contain at least 3 numbers (current: ${numberCount})`,
            details: {
                hasUppercase: true,
                hasLowercase: true,
                hasNumbers: false,
                hasSpecialChar: specialCharCount >= 1,
                uppercaseCount,
                lowercaseCount,
                numberCount,
                specialCharCount
            }
        };
    }

    if (specialCharCount < 1) {
        return {
            isValid: false,
            message: 'Password must contain at least 1 special character (e.g., !@#$%^&*)',
            details: {
                hasUppercase: true,
                hasLowercase: true,
                hasNumbers: true,
                hasSpecialChar: false,
                uppercaseCount,
                lowercaseCount,
                numberCount,
                specialCharCount
            }
        };
    }

    // Todas las validaciones pasaron
    return {
        isValid: true,
        details: {
            hasUppercase: true,
            hasLowercase: true,
            hasNumbers: true,
            hasSpecialChar: true,
            uppercaseCount,
            lowercaseCount,
            numberCount,
            specialCharCount
        }
    };
};

// Versión más simple con expresión regular (alternativa)
export const validatePasswordRegex = (password: string): PasswordValidationResult => {
    if (!password || typeof password !== 'string') {
        return {
            isValid: false,
            message: 'Password is required'
        };
    }

    // Verificar caracteres peligrosos
    const dangerousChars = /[<>'"/;`%]/g;
    if (dangerousChars.test(password)) {
        return {
            isValid: false,
            message: 'Password contains invalid or dangerous characters'
        };
    }

    // Contar con regex
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    const numberCount = (password.match(/[0-9]/g) || []).length;
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (uppercaseCount < 3) {
        return {
            isValid: false,
            message: `Password must contain at least 3 uppercase letters (current: ${uppercaseCount})`,
            details: { uppercaseCount, lowercaseCount, numberCount, hasSpecialChar }
        };
    }

    if (lowercaseCount < 3) {
        return {
            isValid: false,
            message: `Password must contain at least 3 lowercase letters (current: ${lowercaseCount})`,
            details: { uppercaseCount, lowercaseCount, numberCount, hasSpecialChar }
        };
    }

    if (numberCount < 3) {
        return {
            isValid: false,
            message: `Password must contain at least 3 numbers (current: ${numberCount})`,
            details: { uppercaseCount, lowercaseCount, numberCount, hasSpecialChar }
        };
    }

    if (!hasSpecialChar) {
        return {
            isValid: false,
            message: 'Password must contain at least 1 special character',
            details: { uppercaseCount, lowercaseCount, numberCount, hasSpecialChar }
        };
    }

    return { isValid: true };
};

// Función para obtener la contraseña sanitizada (útil antes de hashear)
export const getSanitizedPassword = (password: string): string | null => {
    const { sanitized, hasDangerousChars } = sanitizePassword(password);

    if (hasDangerousChars) {
        return null;
    }

    return sanitized;
};