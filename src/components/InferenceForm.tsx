'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertCircle, History, Download, Upload, Sun, Moon, Play, Database, Share2 } from "lucide-react"
import { useTheme } from "next-themes"
import KnowledgeBaseGraph from './KnowledgeBaseGraph'
import PerformanceAnalysis from './PerformanceAnalysis'

const EXAMPLE_QUERIES = [
    {
        name: "Simple Horn Clauses",
        description: "Basic example with simple Horn clauses and facts",
        content: `TELL
p2=> p3; p3 => p1; c => e; b&e => f; f&g => h; p2&p1&p3 =>d; p1&p3 => c; a; b; p2;

ASK
d`
    },
    {
        name: "Complex Chain",
        description: "Example demonstrating a longer inference chain",
        content: `TELL
p1 => p2; p2 => p3; p3 => p4; p4 => p5; p1;

ASK
p5`
    }
]

export default function InferenceForm() {
    const [input, setInput] = useState(EXAMPLE_QUERIES[0].content)
    const [method, setMethod] = useState('TT')
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [history, setHistory] = useState<Array<{ input: string, method: string, result: string }>>([])
    const { theme, setTheme } = useTheme()
    const [activeTab, setActiveTab] = useState('input')
    const [isProcessing, setIsProcessing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsProcessing(true)
        try {
            const response = await fetch('/api/infer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input, method }),
            })
            if (!response.ok) throw new Error('Network response was not ok')
            const data = await response.json()
            setResult(data.result)
            setHistory(prev => [...prev, { input, method, result: data.result }])
            setActiveTab('result')
        } catch (err) {
            setError('An error occurred while processing your request. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleExport = () => {
        const content = `Input:\n${input}\n\nMethod: ${method}\n\nResult:\n${result}`
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'inference-result.txt'
        a.click()
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.type === 'text/plain') {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const content = e.target?.result as string
                    setInput(content)
                } catch (err) {
                    setError('Invalid file format')
                }
            }
            reader.readAsText(file)
        } else {
            setError('Unsupported file type. Please upload a .txt file only.')
        }
    }

    return (
        <div className="bg-background text-foreground">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4 transition-all" />
                        ) : (
                            <Moon className="h-4 w-4 transition-all" />
                        )}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleExport}>
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4" />
                    </Button>
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".txt"
                    />
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger
                        value="input"
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-slate-800"
                    >
                        Input
                    </TabsTrigger>
                    <TabsTrigger
                        value="visualization"
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-slate-800"
                    >
                        Visualization
                    </TabsTrigger>
                    <TabsTrigger
                        value="result"
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-slate-800"
                    >
                        Result
                    </TabsTrigger>
                    <TabsTrigger
                        value="performance"
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-slate-800"
                    >
                        Performance
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="data-[state=active]:bg-background dark:data-[state=active]:bg-slate-800"
                    >
                        History
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="input">
                    <form onSubmit={handleSubmit}>
                        <Card className="border-muted bg-card dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-foreground">Knowledge Base and Query</CardTitle>
                                <CardDescription className="dark:text-slate-400">
                                    Enter your knowledge base after the TELL keyword and your query after the ASK keyword
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 mb-4">
                                    <TooltipProvider>
                                        {EXAMPLE_QUERIES.map((example, index) => (
                                            <Tooltip key={index}>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            setInput(example.content)
                                                            setActiveTab('input')  // Switch to input tab
                                                        }}
                                                        className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                                                    >
                                                        Load {example.name}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{example.description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ))}
                                    </TooltipProvider>
                                </div>
                                <Textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="mb-4 font-mono bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                                    rows={10}
                                />
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2 dark:text-slate-100">Inference Method</h3>
                                    <RadioGroup value={method} onValueChange={setMethod}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="TT" id="TT" />
                                            <Label htmlFor="TT" className="dark:text-slate-200">Truth Table (TT)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="FC" id="FC" />
                                            <Label htmlFor="FC" className="dark:text-slate-200">Forward Chaining (FC)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="BC" id="BC" />
                                            <Label htmlFor="BC" className="dark:text-slate-200">Backward Chaining (BC)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="flex-1 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                                    >
                                        {isProcessing ? (
                                            "Processing..."
                                        ) : (
                                            <>
                                                <Play className="mr-2 h-4 w-4" /> Infer
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => setActiveTab('performance')}
                                        variant="outline"
                                        className="dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700"
                                    >
                                        <Database className="mr-2 h-4 w-4" /> Benchmark
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </TabsContent>

                <TabsContent value="visualization">
                    <Card className="border-muted bg-card dark:bg-slate-900 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-foreground">Knowledge Base Visualization</CardTitle>
                            <CardDescription className="dark:text-slate-400">Visual representation of the knowledge base as a graph</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <KnowledgeBaseGraph input={input} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="result">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {result && (
                        <Card className="border-muted bg-card dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center text-foreground">
                                    Result
                                    <Share2 className="h-4 w-4" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-muted p-4 rounded-md overflow-x-auto dark:bg-slate-800 dark:text-slate-100">{result}</pre>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="history">
                    <Card className="border-muted bg-card dark:bg-slate-900 dark:border-slate-800">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-foreground">
                                Query History
                                <History className="h-4 w-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {history.length === 0 ? (
                                <p className="text-muted-foreground dark:text-slate-400">No queries yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {history.slice().reverse().map((item, index) => (
                                        <Card 
                                            key={`${item.input}-${item.method}-${index}`} 
                                            className="bg-card dark:bg-slate-800 dark:border-slate-700"
                                        >
                                            <CardHeader>
                                                <CardTitle className="text-sm text-foreground">Query #{index + 1}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid gap-2">
                                                    <div className="font-mono text-sm bg-muted p-2 rounded dark:bg-slate-700 dark:text-slate-100">
                                                        {item.input}
                                                    </div>
                                                    <div className="flex items-center gap-2 dark:text-slate-200">
                                                        <Database className="h-4 w-4" />
                                                        <span className="text-sm">Method: {item.method}</span>
                                                    </div>
                                                    <div className="font-mono text-sm bg-muted p-2 rounded dark:bg-slate-700 dark:text-slate-100">
                                                        {item.result}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="performance">
                    <PerformanceAnalysis input={input} method={method} />
                </TabsContent>
            </Tabs>
        </div>
    )
}