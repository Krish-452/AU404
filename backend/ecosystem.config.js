module.exports = {
    apps: [{
        name: "au404-backend",
        script: "./index.js",
        instances: "max", // Utilize all CPU cores
        exec_mode: "cluster", // Enable clustering
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        },
        log_date_format: "YYYY-MM-DD HH:mm:Z"
    }]
};
