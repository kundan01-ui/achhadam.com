export interface PasswordStrength {
  score: number; // 0-4
  feedback: string;
  isValid: boolean;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  
  let feedback = '';
  let isValid = false;

  if (score === 0) {
    feedback = 'Very weak password';
  } else if (score === 1) {
    feedback = 'Weak password';
  } else if (score === 2) {
    feedback = 'Fair password';
  } else if (score === 3) {
    feedback = 'Good password';
  } else if (score === 4) {
    feedback = 'Strong password';
    isValid = true;
  } else if (score === 5) {
    feedback = 'Very strong password';
    isValid = true;
  }

  return {
    score,
    feedback,
    isValid,
    requirements,
  };
};

export const getPasswordStrengthColor = (score: number): string => {
  if (score <= 1) return 'text-red-500';
  if (score <= 2) return 'text-orange-500';
  if (score <= 3) return 'text-yellow-500';
  if (score <= 4) return 'text-blue-500';
  return 'text-green-500';
};

export const getPasswordStrengthBgColor = (score: number): string => {
  if (score <= 1) return 'bg-red-500';
  if (score <= 2) return 'bg-orange-500';
  if (score <= 3) return 'bg-yellow-500';
  if (score <= 4) return 'bg-blue-500';
  return 'bg-green-500';
};



