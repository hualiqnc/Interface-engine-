export interface PerformanceMetrics {
    averageTime: number;
    maxTime: number;
    minTime: number;
    successRate: number;
    totalIterations: number;
}

export async function benchmarkInference(
    input: string,
    method: string,
    iterations: number = 100
): Promise<PerformanceMetrics> {
    const times: number[] = []
    let successes = 0

    for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        
        const response = await fetch('/api/infer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input, method }),
        })
        
        const data = await response.json()
        const end = performance.now()
        
        times.push(end - start)
        if (data.result.startsWith('YES')) successes++
    }

    return {
        averageTime: times.reduce((a, b) => a + b) / times.length,
        maxTime: Math.max(...times),
        minTime: Math.min(...times),
        successRate: (successes / iterations) * 100,
        totalIterations: iterations
    }
} 