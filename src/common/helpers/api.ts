import { User } from "src/modules/users/entities/user.entity";

export function toSafeUser(user: User): User {
    if (!user) return user;

    const { password, refresh_token, note, active, password_version, ...safeUser } = user;
    return safeUser as User;
}