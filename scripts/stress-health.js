const http = require('node:http');
const { performance } = require('node:perf_hooks');
const app = require('../app');

const total = Number(process.env.STRESS_REQUESTS || 2000);
const concurrency = Number(process.env.STRESS_CONCURRENCY || 50);

function request(port) {
    return new Promise((resolve) => {
        const req = http.get({ hostname: '127.0.0.1', port, path: '/health', agent: false }, (res) => {
            res.resume();
            res.on('end', () => resolve(res.statusCode));
        });
        req.on('error', () => resolve(0));
    });
}

const server = app.listen(0, '127.0.0.1', async () => {
    const port = server.address().port;
    let next = 0;
    let succeeded = 0;
    const latencies = [];
    const started = performance.now();
    async function worker() {
        while (next < total) {
            next += 1;
            const before = performance.now();
            if (await request(port) === 200) succeeded += 1;
            latencies.push(performance.now() - before);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    const elapsed = performance.now() - started;
    latencies.sort((a, b) => a - b);
    const percentile = (value) => latencies[Math.min(latencies.length - 1, Math.ceil(value * latencies.length) - 1)];
    console.log(JSON.stringify({
        requests: total,
        concurrency,
        succeeded,
        failed: total - succeeded,
        requestsPerSecond: Number((total / (elapsed / 1000)).toFixed(1)),
        latencyMs: { p50: Number(percentile(0.50).toFixed(2)), p95: Number(percentile(0.95).toFixed(2)), p99: Number(percentile(0.99).toFixed(2)) },
        elapsedMs: Number(elapsed.toFixed(2)),
    }, null, 2));
    server.close(() => process.exit(succeeded === total ? 0 : 1));
});
