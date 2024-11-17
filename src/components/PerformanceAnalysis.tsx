'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Play } from "lucide-react"
import { benchmarkInference, type PerformanceMetrics } from '@/lib/performance'

interface PerformanceAnalysisProps {
    input: string;
    method: string;
}

export default function PerformanceAnalysis({ input, method }: PerformanceAnalysisProps) {
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [error, setError] = useState('')

    const runBenchmark = async () => {
        setIsRunning(true)
        setError('')
        try {
            const results = await benchmarkInference(input, method, 50)
            setMetrics(results)
        } catch (err) {
            setError('Failed to run performance analysis')
        } finally {
            setIsRunning(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Performance Analysis</CardTitle>
                <CardDescription>
                    Benchmark the current inference method with multiple iterations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Button 
                        onClick={runBenchmark} 
                        disabled={isRunning}
                        className="w-full"
                    >
                        {isRunning ? (
                            "Running Analysis..."
                        ) : (
                            <>
                                <Play className="mr-2 h-4 w-4" /> Run Benchmark
                            </>
                        )}
                    </Button>

                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {metrics && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Average Time</p>
                                <p className="text-2xl font-bold">
                                    {metrics.averageTime.toFixed(2)}ms
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Success Rate</p>
                                <p className="text-2xl font-bold">
                                    {metrics.successRate.toFixed(1)}%
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Min Time</p>
                                <p className="text-2xl font-bold">
                                    {metrics.minTime.toFixed(2)}ms
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Max Time</p>
                                <p className="text-2xl font-bold">
                                    {metrics.maxTime.toFixed(2)}ms
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
} 