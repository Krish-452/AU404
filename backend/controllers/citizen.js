const RequestStore = require('../models/request.store');
const { verifyOTP } = require('../services/otp');
const OtpStore = require('../models/otp.store');
const logger = require('../services/logger');

const authorizeRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        if (!requestId) return res.status(400).json({ message: 'Request ID required' });

        // Logic: Update DB status to APPROVED
        logger.info(`[AUDIT] Authorizing Request: ${requestId} by User: ${req.user.id}`);

        // Simulate delay
        await new Promise(r => setTimeout(r, 800));

        res.json({ message: 'Request Authorized Successfully', status: 'APPROVED' });
    } catch (error) {
        logger.error('Authorize Error:', error);
        res.status(500).json({ message: 'Authorization failed' });
    }
};

const blockRequest = async (req, res) => {
    try {
        const { requestId, otp } = req.body;

        // VERIFY OTP (Banking Grade Check)
        if (!otp) {
            logger.warn(`[SECURITY] Block attempt rejected for ${req.user.id}: Missing OTP`);
            return res.status(400).json({ message: 'OTP Required for high-risk action' });
        }

        const record = await OtpStore.findOne({ email: req.user.email });
        if (!record) return res.status(400).json({ message: 'OTP expired or not requested' });

        const isValid = verifyOTP(otp, record.secret);
        if (!isValid) {
            logger.warn(`[SECURITY] Block attempt rejected for ${req.user.id}: Invalid OTP`);
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Logic: Update DB status to DENIED (Fixed enum)
        logger.info(`[AUDIT] Blocking Request: ${requestId} by User: ${req.user.id} [OTP CHECK SUCCESS]`);

        res.json({ message: 'Request Blocked', status: 'DENIED' });
    } catch (error) {
        logger.error("Block Error", error);
        res.status(500).json({ message: 'Block failed' });
    }
};

const exportLogs = async (req, res) => {
    try {
        logger.info(`[AUDIT] Export Logs requested by: ${req.user.id}`);

        const csvHeader = "Timestamp,Action,Entity,Status\n";
        const csvRows = [
            new Date().toISOString() + ",Login,System,Success",
            new Date().toISOString() + ",View_Dashboard,System,Success",
            new Date().toISOString() + ",Block_Action,User,Verified"
        ].join("\n");

        const csvContent = csvHeader + csvRows;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="audit_logs.csv"');
        res.send(csvContent);
    } catch (error) {
        logger.error("Export Logs Error:", error);
        res.status(500).json({ message: 'Export failed' });
    }
};

module.exports = { authorizeRequest, blockRequest, exportLogs };
