const crypto = require('crypto');
const mcl = require('mcl-wasm');

class SecureStorage {
    constructor() {
        this.ready = false;
        this.G1_GEN_STR = "SecureStorage_Gen_G1_Prod_v1";
        this.G2_GEN_STR = "SecureStorage_Gen_G2_Prod_v1";
    }

    async init() {
        if (this.ready) return;
        
        try {
            await mcl.init(mcl.BN254);
            this.g1 = new mcl.G1(); 
            this.g1.setHashOf(this.G1_GEN_STR);
            
            this.g2 = new mcl.G2(); 
            this.g2.setHashOf(this.G2_GEN_STR);

            this.ready = true;
        } catch (e) {
            console.error("Critical Error: Failed to init crypto engine", e);
            throw e;
        }
    }

    /**
     * 1. KEY GENERATION
     * Creates a new User Identity (Private Key + Dual Public Key)
     * Returns: { sk: HexString, pk: "HexG1:HexG2" }
     */
    createIdentity() {
        const x = new mcl.Fr();
        x.setByCSPRNG();
        const pk1 = mcl.mul(this.g1, x);
        const pk2 = mcl.mul(this.g2, x);

        return {
            sk: x.serializeToHexStr(),
            pk: `${pk1.serializeToHexStr()}:${pk2.serializeToHexStr()}`
        };
    }

    /**
     * 2. ENCRYPT (Owner)
     * Generates AES key via KEM, Encrypts file, returns DB object
     */
    encryptForStorage(fileBuffer, fileName, ownerPkString) {
        const [pk1Hex] = ownerPkString.split(':');
        const pk1 = new mcl.G1(); pk1.deserializeHexStr(pk1Hex);
        const r = new mcl.Fr(); r.setByCSPRNG();
        const g2r = mcl.mul(this.g2, r);
        const secretElement = mcl.pairing(this.g1, g2r); 
        const aesKey = this._deriveKey(secretElement);
        const C1 = mcl.mul(pk1, r);
        const encryption = this._aesEncrypt(fileBuffer, aesKey);

        return {
            fileName,
            blob: encryption, 
            security: {
                ownerPublicKey: ownerPkString,
                encryptedKey: {
                    level: 2, 
                    C1: C1.serializeToHexStr()
                }
            }
        };
    }

    /**
     * 3. DECRYPT (Owner)
     * Recovers AES key using Owner's Secret Key
     */
    decryptAsOwner(dbRecord, ownerSkHex) {
        const x = new mcl.Fr(); x.deserializeHexStr(ownerSkHex);
        const C1 = new mcl.G1(); C1.deserializeHexStr(dbRecord.security.encryptedKey.C1);
        const invX = mcl.inv(x);
        const T = mcl.pairing(C1, this.g2);
        const secretElement = mcl.pow(T, invX);
        
        const aesKey = this._deriveKey(secretElement);
        return this._aesDecrypt(dbRecord.blob, aesKey);
    }

    /**
     * 4. GRANT PERMISSION (Owner -> Recipient)
     * Creates a Re-Encryption Key (rk)
     * This runs on the client side (or server if you trust it with SK)
     */
    generatePermissions(ownerSkHex, recipientPkString) {
        const xAlice = new mcl.Fr(); xAlice.deserializeHexStr(ownerSkHex);
        const [, pk2BobHex] = recipientPkString.split(':');
        const pk2Bob = new mcl.G2(); pk2Bob.deserializeHexStr(pk2BobHex);
        const invAlice = mcl.inv(xAlice);
        const rk = mcl.mul(pk2Bob, invAlice);

        return rk.serializeToHexStr();
    }

    /**
     * 5. RE-ENCRYPT (Server)
     * Transforms capsule from Owner -> Recipient using the reKey
     * No Private Keys required here!
     */
    reEncryptForDelegate(dbRecord, reKeyHex) {
        const C1 = new mcl.G1(); C1.deserializeHexStr(dbRecord.security.encryptedKey.C1);
        const rk = new mcl.G2(); rk.deserializeHexStr(reKeyHex);
        const trans = mcl.pairing(C1, rk);

        return {
            level: 1,
            trans: trans.serializeToHexStr()
        };
    }

    decryptAsDelegate(sharedCapsule, fileBlob, delegateSkHex) {
        const xBob = new mcl.Fr(); xBob.deserializeHexStr(delegateSkHex);
        const trans = new mcl.GT(); trans.deserializeHexStr(sharedCapsule.trans);
        const invBob = mcl.inv(xBob);
        const secretElement = mcl.pow(trans, invBob);

        const aesKey = this._deriveKey(secretElement);
        return this._aesDecrypt(fileBlob, aesKey);
    }

    
    _deriveKey(gtElement) {
        const raw = gtElement.serializeToHexStr();
        return crypto.createHash('sha256').update(raw).digest();
    }

    _aesEncrypt(buffer, key) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let encrypted = cipher.update(buffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return {
            iv: iv.toString('hex'),
            tag: cipher.getAuthTag().toString('hex'),
            data: encrypted.toString('hex')
        };
    }

    _aesDecrypt(blob, key) {
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm', 
            key, 
            Buffer.from(blob.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(blob.tag, 'hex'));
        let decrypted = decipher.update(blob.data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

module.exports = SecureStorage;