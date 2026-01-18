const logger = require('./logger');

class PerformanceMonitor {
  static metrics = {};

  static startTimer(label) {
    this.metrics[label] = process.hrtime.bigint();
  }

  static endTimer(label) {
    if (!this.metrics[label]) {
      logger.warn(`Timer '${label}' was not started`);
      return null;
    }

    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - this.metrics[label]) / 1_000_000; // Convert to ms
    delete this.metrics[label];
    
    logger.debug(`Operation '${label}' took ${duration.toFixed(2)}ms`);
    return duration;
  }

  static middleware() {
    return (req, res, next) => {
      const label = `${req.method} ${req.path}`;
      this.startTimer(label);

      res.on('finish', () => {
        const duration = this.endTimer(label);
        if (duration > 1000) {
          logger.warn(`Slow request detected: ${label} took ${duration.toFixed(2)}ms`);
        }
      });

      next();
    };
  }
}

module.exports = PerformanceMonitor;
