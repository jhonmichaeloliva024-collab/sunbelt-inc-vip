/**
 * Standard text password and presentation utilities.
 * User passwords are saved and handled as standard text.
 */

export async function hashPassword(password: string): Promise<string> {
  // Returns standard text as requested
  return password.trim();
}

export function maskPassword(password: string): string {
  if (!password) return '••••••••';
  return '•'.repeat(Math.max(8, Math.min(password.length, 16)));
}
