import speakeasy from 'speakeasy';
import { User } from '../models/User';

export const autoSeed = async () => {
    try {
        // Always clear for consistent demo state
        await User.deleteMany({});
        console.log('Database cleared. Re-seeding test data...');

        // Common secret for testing ease
        // We use a fixed secret so the walkthrough/documentation is valid even after restart
        const secret = 'KRUGS4ZANFZSA3LZEBQXK4LM'; // Base32

        const users = [
            {
                email: 'citizen@idhub.com',
                password: 'password123',
                role: 'CITIZEN',
                name: 'John Citizen',
                domain: undefined
            },
            {
                email: 'company@idhub.com',
                password: 'password123',
                role: 'COMPANY',
                name: 'Acme Corp',
                domain: 'acme.com'
            },
            {
                email: 'admin@idhub.com',
                password: 'password123',
                role: 'ADMIN',
                name: 'System Admin',
                domain: undefined
            }
        ];

        for (const u of users) {
            await User.create({
                email: u.email,
                passwordHash: u.password,
                role: u.role,
                name: u.name,
                domain: u.domain,
                mfaSecret: secret,
                mfaEnabled: true
            });
        }

        console.log('------------------------------------------------');
        console.log('AUTO-SEED COMPLETE');
        console.log(`MFA SECRET: ${secret}`);
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('Auto-seed failed:', error);
    }
};
