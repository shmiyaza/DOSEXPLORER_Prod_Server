import bcrypt from 'bcryptjs';

export class bcryptOperation {
    constructor() { }

    // To hash string
    static async toHashString(data: string = "defaultPassword") {
        return await bcrypt.hash(data, 10);
    }

    // Compare hash string
    static async compareHashString(data: string, hash: string) {
        return await bcrypt.compare(data, hash);
    }
}
