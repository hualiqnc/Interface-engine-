'use client'

import { useEffect, useState, useCallback } from 'react'
import ReactFlow, { Background, Controls, Edge, Node, useNodesState, useEdgesState } from 'reactflow'
import 'reactflow/dist/style.css'
import { parseInput } from '@/lib/inference'

interface KnowledgeBaseGraphProps {
    input: string
}

export default function KnowledgeBaseGraph({ input }: KnowledgeBaseGraphProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const calculateLayout = useCallback((kb: any) => {
        const nodeSet = new Set<string>()
        const nodeList: Node[] = []
        const edgeList: Edge[] = []
        
        // Parse the query from input
        const query = input.split('ASK')[1]?.trim() || ''

        // First pass: collect all unique nodes
        if (kb.facts) {
            kb.facts.forEach((fact: string) => nodeSet.add(fact))
        }
        
        if (kb.rules) {
            kb.rules.forEach((rule: any) => {
                if (rule.antecedents) {
                    rule.antecedents.forEach((ant: any) => {
                        if (ant.type === 'LITERAL') {
                            nodeSet.add(ant.value as string)
                        }
                    })
                }
                if (rule.consequent && rule.consequent.type === 'LITERAL') {
                    nodeSet.add(rule.consequent.value as string)
                }
            })
        }

        // Calculate grid dimensions and spacing
        const totalNodes = nodeSet.size
        const columns = Math.ceil(Math.sqrt(totalNodes))
        const rows = Math.ceil(totalNodes / columns)
        const viewportWidth = typeof window !== 'undefined' ? window.innerWidth * 0.8 : 800
        const viewportHeight = 400
        const spacingX = viewportWidth / (columns + 1)
        const spacingY = viewportHeight / (rows + 1)

        // Create nodes with calculated positions
        let row = 0
        let col = 0
        let nodeId = 0
        nodeSet.forEach((node) => {
            const isQuery = node === query
            const isFact = kb.facts?.has(node)
            
            nodeList.push({
                id: `node-${nodeId}-${node}`,
                data: { label: node },
                position: {
                    x: (col + 1) * spacingX,
                    y: (row + 1) * spacingY
                },
                className: `rounded px-4 py-2 ${
                    isQuery 
                        ? 'bg-primary text-primary-foreground font-bold text-lg transform scale-125' 
                        : isFact
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                }`
            })

            col++
            if (col >= columns) {
                col = 0
                row++
            }
            nodeId++
        })

        // Create edges (rest of the code remains the same)
        let edgeId = 0
        kb.rules?.forEach((rule: any) => {
            if (rule.antecedents && rule.consequent?.type === 'LITERAL') {
                rule.antecedents.forEach((ant: any) => {
                    if (ant.type === 'LITERAL') {
                        edgeList.push({
                            id: `edge-${edgeId++}`,
                            source: `node-${nodeList.findIndex(n => n.data.label === ant.value)}-${ant.value}`,
                            target: `node-${nodeList.findIndex(n => n.data.label === rule.consequent.value)}-${rule.consequent.value}`,
                            className: 'animate-pulse'
                        })
                    }
                })
            }
        })

        return { nodes: nodeList, edges: edgeList }
    }, [input])

    useEffect(() => {
        try {
            const { kb } = parseInput(input)
            const { nodes: newNodes, edges: newEdges } = calculateLayout(kb)
            setNodes(newNodes)
            setEdges(newEdges)
        } catch (error) {
            console.error('Error parsing input for visualization:', error)
        }
    }, [input, calculateLayout, setNodes, setEdges])

    return (
        <div className="w-full h-[400px] relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                className="bg-background"
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}