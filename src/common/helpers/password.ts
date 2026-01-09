import * as argon2 from 'argon2';

export class PasswordUtil {
    /**
     * Hash password (argon2id)
     */
    static async hash(password: string): Promise<string> {
        return argon2.hash(password);
    }

    /**
     * Verify password
     */
    static async verify(
        hashedPassword: string,
        plainPassword: string,
    ): Promise<boolean> {
        return argon2.verify(hashedPassword, plainPassword);
    }
}
