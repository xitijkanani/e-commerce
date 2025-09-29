import { hash, verify } from "@node-rs/argon2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { sha1 } from "@oslojs/crypto/sha1";

export async function hashPassword(password: string) {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
}

export async function verifyPasswordHash(hash: string, password: string) {
    return await verify(hash, password);
}

export async function verifyPasswordStrength(password: string) {
    if (password.length < 8 || password.length > 255) return false;

    const hash = encodeHexLowerCase(sha1(new TextEncoder().encode(password)));
    const hashPrefix = hash.slice(0, 5);

    const response = await fetch(
        `https://api.pwnedpasswords.com/range/${hashPrefix}`
    );

    const data = await response.text();
    const items = data.split("\n");

    for (const item of items) {
        const hashSuffix = item.slice(0, 35).toLowerCase();
        if (hash === hashPrefix + hashSuffix) return false;
    }

    return true;
}
