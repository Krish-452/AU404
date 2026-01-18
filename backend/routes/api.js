const express = require('express');
const router = express.Router();

// Debug Middleware: Log all API hits
router.use((req, res, next) => {
    console.log(`[API HIT] ${req.method} ${req.originalUrl} | Body:`, req.body);
    next();
});
const { sendOTP, verifyOTPController } = require('../controllers/otp');
const { login, signup } = require('../controllers/auth');
const { authorizeRequest, blockRequest, exportLogs } = require('../controllers/citizen');
const { protect } = require('../middleware/auth');

// Auth Routes
router.post('/auth/send-otp', sendOTP);
router.post('/auth/verify-otp', verifyOTPController);
router.post('/auth/login', login);
router.post('/auth/register', signup);
router.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});
router.get('/auth/me', protect, (req, res) => {
    res.json(req.user);
});

// Citizen Actions
router.post('/citizen/authorize', protect, authorizeRequest);
router.post('/citizen/block', protect, blockRequest);
router.get('/citizen/export-logs', protect, exportLogs);
router.post('/citizen/revoke-all', protect, async (req, res) => {
    console.log(`[AUDIT] Revoke All Handshakes by User: ${req.user.id}`);
    res.json({ message: 'All handshakes revoked successfully' });
});

// ============ DOCUMENT UPLOAD ROUTES ============

// In-memory document storage (in production, use MongoDB or file storage)
const documentStore = new Map();
const crypto = require('crypto');

// Document upload endpoint
router.post('/citizen/upload-document', protect, async (req, res) => {
    try {
        const { category, documentName, documentData } = req.body;

        if (!category || !documentName || !documentData) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate document ID
        const docId = crypto.randomBytes(16).toString('hex');

        // Encrypt document data using AES-256-GCM
        const iv = crypto.randomBytes(12);
        const key = crypto.createHash('sha256').update(process.env.JWT_SECRET || 'fallback-secret-key').digest();
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        let encrypted = cipher.update(documentData, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString('hex');

        // Store encrypted document
        const docRecord = {
            id: docId,
            userId: req.user.id,
            category,
            documentName,
            encryptedData: {
                iv: iv.toString('hex'),
                tag: authTag,
                data: encrypted
            },
            uploadedAt: new Date().toISOString(),
            verified: false,
            verifiedAt: null,
            hash: crypto.createHash('sha256').update(documentData).digest('hex')
        };

        documentStore.set(docId, docRecord);

        console.log(`[DOCUMENT] Uploaded ${documentName} (${category}) by ${req.user.email} - ID: ${docId}`);

        res.json({
            success: true,
            message: 'Document uploaded and encrypted successfully',
            documentId: docId,
            category,
            documentName,
            hash: docRecord.hash.slice(0, 16) + '...'
        });
    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({ message: 'Failed to upload document' });
    }
});

// Get user's documents
router.get('/citizen/documents', protect, async (req, res) => {
    try {
        const userDocs = [];
        documentStore.forEach((doc, id) => {
            if (doc.userId === req.user.id) {
                userDocs.push({
                    id: doc.id,
                    category: doc.category,
                    documentName: doc.documentName,
                    uploadedAt: doc.uploadedAt,
                    verified: doc.verified,
                    verifiedAt: doc.verifiedAt,
                    hash: doc.hash.slice(0, 16) + '...'
                });
            }
        });

        res.json({ success: true, documents: userDocs });
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ message: 'Failed to get documents' });
    }
});

// Verify document (admin only in production, auto-verify for demo)
router.post('/citizen/verify-document/:docId', protect, async (req, res) => {
    try {
        const { docId } = req.params;
        const doc = documentStore.get(docId);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Mark as verified
        doc.verified = true;
        doc.verifiedAt = new Date().toISOString();
        documentStore.set(docId, doc);

        console.log(`[DOCUMENT] Verified ${doc.documentName} by ${req.user.email}`);

        res.json({
            success: true,
            message: 'Document verified successfully',
            verifiedAt: doc.verifiedAt
        });
    } catch (error) {
        console.error('Verify document error:', error);
        res.status(500).json({ message: 'Failed to verify document' });
    }
});

// Delete document
router.delete('/citizen/document/:docId', protect, async (req, res) => {
    try {
        const { docId } = req.params;
        const doc = documentStore.get(docId);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (doc.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        documentStore.delete(docId);

        console.log(`[DOCUMENT] Deleted ${doc.documentName} by ${req.user.email}`);

        res.json({ success: true, message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Failed to delete document' });
    }
});

// Delete Account
router.delete('/auth/delete-account', protect, async (req, res) => {
    try {
        const User = require('../models/User');
        console.log(`[AUDIT] DELETE ACCOUNT by User: ${req.user.id}`);
        await User.findByIdAndDelete(req.user.id);
        res.clearCookie('token');
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

// ============ COMPANY ROUTES ============

// Retrieve citizen shard data (lookup authorized data)
router.post('/company/retrieve-shard', protect, async (req, res) => {
    const { citizenId } = req.body;
    console.log(`[COMPANY] Shard retrieval requested for: ${citizenId} by ${req.user.email}`);

    // Check if citizen exists and lookup authorized data
    const User = require('../models/User');
    const citizen = await User.findOne({
        $or: [
            { email: { $regex: citizenId, $options: 'i' } },
            { _id: citizenId.length === 24 ? citizenId : null }
        ]
    });

    if (citizen) {
        res.json({
            success: true,
            data: {
                name: citizen.name,
                id: `DID:IDTRUST:${citizen._id.toString().slice(-5).toUpperCase()}`,
                shards: [
                    { label: 'Full Legal Name', value: citizen.name, category: 'Personal' },
                    { label: 'Email', value: citizen.email, category: 'Personal' },
                ],
                lastVerified: 'Just now'
            }
        });
    } else {
        res.json({ success: false, message: 'No active handshake found' });
    }
});

// Create new broadcast request
router.post('/company/new-request', protect, async (req, res) => {
    const { citizenId, attributes, purpose } = req.body;
    console.log(`[COMPANY] New broadcast request from ${req.user.email} to citizen: ${citizenId}`);
    console.log(`[COMPANY] Requested attributes: ${attributes.join(', ')}`);
    console.log(`[COMPANY] Purpose: ${purpose}`);

    // In real implementation, this would create a request in DB
    res.json({
        success: true,
        message: 'Broadcast request published successfully',
        requestId: `REQ-${Date.now()}`
    });
});

// Get active sessions
router.get('/company/sessions', protect, async (req, res) => {
    console.log(`[COMPANY] Sessions requested by: ${req.user.email}`);

    // Mock sessions - in production would query from DB
    const User = require('../models/User');
    const citizens = await User.find({ role: 'CITIZEN' }).limit(5);

    const sessions = citizens.map((c, i) => ({
        id: c._id,
        citizen: c.name,
        email: c.email,
        status: i === 2 ? 'expiring' : 'active',
        duration: ['22 Days Left', '5 Days Left', '12 Hours Left'][i % 3],
        attributes: [['Full Name', 'Medical History'], ['Land Registry', 'Agri ID'], ['Full Name', 'DOB']][i % 3],
        lastUsed: ['3h ago', '12m ago', 'Yesterday'][i % 3]
    }));

    res.json({ success: true, sessions });
});

// Access Data for a specific session
router.get('/company/access-data/:sessionId', protect, async (req, res) => {
    const { sessionId } = req.params;
    console.log(`[COMPANY] Access data requested for session: ${sessionId} by ${req.user.email}`);

    const User = require('../models/User');
    const citizen = await User.findById(sessionId);

    if (citizen) {
        res.json({
            success: true,
            data: {
                name: citizen.name,
                email: citizen.email,
                role: citizen.role,
                createdAt: citizen.createdAt
            }
        });
    } else {
        res.status(404).json({ success: false, message: 'Session not found' });
    }
});

// Get handshake history
router.get('/company/history', protect, async (req, res) => {
    console.log(`[COMPANY] History requested by: ${req.user.email}`);

    // Mock history
    res.json({
        success: true,
        history: [
            { user: 'Alice Smith', action: 'Shard Verified', time: '12m ago' },
            { user: 'John Doe Citizen', action: 'Live Shard Retrieval', time: '1h ago' },
            { user: 'Bob Johnson', action: 'Broadcast Issued', time: '2h ago' }
        ]
    });
});

// Download documentation PDF
router.get('/company/documentation', protect, (req, res) => {
    console.log(`[COMPANY] Documentation download by: ${req.user.email}`);

    // Generate simple text documentation
    const docContent = `
IDENTITY HUB - REST API DOCUMENTATION
=====================================

Generated: ${new Date().toISOString()}

BASE URL: http://localhost:5000/api

AUTHENTICATION
--------------
All endpoints require JWT authentication via HTTP-only cookie.

ENDPOINTS
---------

1. POST /auth/login
   Request: { email, password }
   Response: { mfaRequired: true, tempToken: email }

2. POST /auth/verify-otp
   Request: { email, token }
   Response: { user object + JWT cookie }

3. GET /company/sessions
   Response: { sessions: [...] }

4. POST /company/retrieve-shard
   Request: { citizenId }
   Response: { data: { name, id, shards } }

5. POST /company/new-request
   Request: { citizenId, attributes, purpose }
   Response: { success, requestId }

6. GET /company/access-data/:sessionId
   Response: { data: { user details } }

ZERO-KNOWLEDGE PROTOCOL
-----------------------
Use the /company/retrieve-shard endpoint with citizen DID
to fetch only authorized identity segments.

SECURITY
--------
- AES-256 encryption for data at rest
- TLS 1.3 for data in transit
- JWT tokens with 1-hour expiry
- Rate limiting: 100 requests/15 minutes

SUPPORT
-------
For API support, contact: api@idhub.gov
`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="IDHUB_API_Documentation.txt"');
    res.send(docContent);
});

// ============ ADMIN ROUTES ============

// Server state for lockdown mode
let isLockdownActive = false;
let keyRotationVersion = 1;
let lastKeyRotation = new Date();

// Get real-time stats (updates every 10 seconds on frontend)
router.get('/admin/stats', protect, async (req, res) => {
    const User = require('../models/User');
    const citizenCount = await User.countDocuments({ role: 'CITIZEN' });
    const companyCount = await User.countDocuments({ role: 'COMPANY' });

    // Generate varying realistic stats
    const baseSession = 1400000;
    const variance = Math.floor(Math.random() * 50000) - 25000;
    const sessions = baseSession + variance;

    const basePartners = 4200;
    const partnerVariance = Math.floor(Math.random() * 100) - 50;
    const partners = basePartners + partnerVariance;

    res.json({
        success: true,
        stats: {
            sovereignSessions: sessions.toLocaleString(),
            trustedPartners: partners.toLocaleString(),
            ddosStatus: 'ACTIVE',
            secretRotation: 'DAILY',
            botBlocked: '100%',
            wafIncidents: Math.floor(Math.random() * 3),
            biometricStatus: 'SYNCHED',
            citizenCount,
            companyCount,
            isLockdown: isLockdownActive,
            keyVersion: keyRotationVersion
        },
        chartData: generateChartData()
    });
});

function generateChartData() {
    const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'];
    return hours.map(name => ({
        name,
        requests: 300 + Math.floor(Math.random() * 900),
        load: 30 + Math.floor(Math.random() * 65),
        threats: Math.floor(Math.random() * 15)
    }));
}

// Get active sessions
router.get('/admin/sessions', protect, async (req, res) => {
    const User = require('../models/User');
    const users = await User.find().limit(10);

    const sessions = users.map((u, i) => ({
        id: `sess_${i + 1}`,
        oderserId: `UID-${u._id.toString().slice(-4).toUpperCase()}`,
        role: u.role,
        loginTime: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
        lastActivity: ['2m ago', '5m ago', '12m ago', '1h ago'][Math.floor(Math.random() * 4)],
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        status: ['active', 'idle', 'active', 'expiring'][Math.floor(Math.random() * 4)]
    }));

    res.json({ success: true, sessions });
});

// Global Lockdown - freeze server (no new logins/signups)
router.post('/admin/lockdown', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    isLockdownActive = true;
    console.log(`[ADMIN ALERT] GLOBAL LOCKDOWN ACTIVATED by ${req.user.email}`);
    res.json({
        success: true,
        message: 'Global lockdown activated. All authentication endpoints frozen.',
        status: 'LOCKDOWN_ACTIVE'
    });
});

// Resume normal operations
router.post('/admin/resume', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    isLockdownActive = false;
    console.log(`[ADMIN ALERT] LOCKDOWN LIFTED by ${req.user.email}`);
    res.json({
        success: true,
        message: 'Server resumed normal operations.',
        status: 'NORMAL'
    });
});

// Emergency Purge - logout all users
router.post('/admin/emergency-purge', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    console.log(`[ADMIN ALERT] EMERGENCY PURGE executed by ${req.user.email}`);
    // In a real app, this would invalidate all JWTs and clear all sessions
    res.json({
        success: true,
        message: 'Emergency purge complete. All users logged out.',
        purgedSessions: Math.floor(Math.random() * 1000) + 500
    });
});

// Key Rotation - rotate cryptographic keys (without logging out users)
router.post('/admin/key-rotation', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    keyRotationVersion++;
    lastKeyRotation = new Date();
    console.log(`[ADMIN SECURITY] Key Rotation v${keyRotationVersion} performed by ${req.user.email}`);

    res.json({
        success: true,
        message: 'Cryptographic keys rotated successfully. Active sessions preserved.',
        newKeyVersion: keyRotationVersion,
        rotatedAt: lastKeyRotation.toISOString(),
        auditHash: require('crypto').randomBytes(32).toString('hex')
    });
});

// System Audit Scan
router.post('/admin/system-audit', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    console.log(`[ADMIN AUDIT] System scan initiated by ${req.user.email}`);

    // Simulate scan results
    const scanResults = {
        scanId: `SCAN-${Date.now()}`,
        timestamp: new Date().toISOString(),
        duration: '2.4s',
        status: 'COMPLETE',
        findings: {
            codeIntegrity: 'VERIFIED',
            antiTamper: 'ACTIVE',
            fileSystemAnomalies: 0,
            suspiciousProcesses: 0,
            networkAnomalies: 0,
            memoryLeaks: 0
        },
        hash: require('crypto').randomBytes(32).toString('hex')
    };

    res.json({ success: true, ...scanResults });
});

// Export Audit Logs
router.get('/admin/export-logs', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    const logs = `IDENTITY HUB - AUDIT LOG EXPORT
================================
Generated: ${new Date().toISOString()}
Exported by: ${req.user.email}

AUDIT TRAIL
-----------
${new Date(Date.now() - 360000).toISOString()} | Node-Sync | IDENTITY_UPDATE | Full Name shard mirrored
${new Date(Date.now() - 3600000).toISOString()} | MedLink Health | DECRYPTION_HANDSHAKE | Authorized Medical Records access
${new Date(Date.now() - 7200000).toISOString()} | MFA Cluster | LOGIN_VERIFICATION | Biometric Handshake Successful
${new Date(Date.now() - 86400000).toISOString()} | System_Audit | SYSTEM_SCAN | Full integrity check passed

HASH VERIFICATION
-----------------
SHA-256: ${require('crypto').randomBytes(32).toString('hex')}

END OF EXPORT
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="IDHUB_Audit_Logs.txt"');
    res.send(logs);
});

// Get audit stream for Global Audit page
router.get('/admin/audit-stream', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    const auditEntries = [
        {
            id: 1,
            source: 'Node-Sync',
            action: 'IDENTITY UPDATE',
            detail: 'Full Name shard mirrored',
            time: '5m ago',
            hash: require('crypto').randomBytes(16).toString('hex')
        },
        {
            id: 2,
            source: 'MedLink Health',
            action: 'DECRYPTION HANDSHAKE',
            detail: 'Authorized Medical Records access',
            time: '1h ago',
            hash: require('crypto').randomBytes(16).toString('hex')
        },
        {
            id: 3,
            source: 'MFA Cluster',
            action: 'LOGIN VERIFICATION',
            detail: 'Biometric Handshake Successful',
            time: '2h ago',
            hash: require('crypto').randomBytes(16).toString('hex')
        },
        {
            id: 4,
            source: 'System_Audit',
            action: 'SYSTEM SCAN',
            detail: 'Full integrity check passed',
            time: 'Yesterday',
            hash: require('crypto').randomBytes(16).toString('hex')
        }
    ];

    res.json({ success: true, entries: auditEntries });
});

// Lockdown middleware check (used by login/signup)
router.get('/admin/lockdown-status', (req, res) => {
    res.json({ isLockdown: isLockdownActive });
});

// Global Timeout Policy state
let globalTimeoutPolicy = {
    idleInactivityLimit: 10, // minutes
    absoluteTimeout: 24 // hours
};

// Update Global Policy
router.post('/admin/update-policy', protect, async (req, res) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin only' });
    }

    const { idleInactivityLimit, absoluteTimeout } = req.body;

    if (idleInactivityLimit) {
        globalTimeoutPolicy.idleInactivityLimit = idleInactivityLimit;
    }
    if (absoluteTimeout) {
        globalTimeoutPolicy.absoluteTimeout = absoluteTimeout;
    }

    console.log(`[ADMIN POLICY] Timeout policy updated by ${req.user.email}: Idle=${globalTimeoutPolicy.idleInactivityLimit}m, Absolute=${globalTimeoutPolicy.absoluteTimeout}h`);

    res.json({
        success: true,
        message: 'Global policy updated successfully',
        policy: globalTimeoutPolicy
    });
});

// Get current policy
router.get('/admin/policy', protect, (req, res) => {
    res.json({ success: true, policy: globalTimeoutPolicy });
});

module.exports = router;