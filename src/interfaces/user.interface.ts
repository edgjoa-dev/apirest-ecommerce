export interface IUser {
    name: string;
    email: string;
    password: string;
    role: Role;
    status: boolean;
    google: boolean;
    creaAt: Date;
}

export type Role = 'ADMIN_ROLE' | 'USER_ROLE' | 'VENTAS_ROLE'