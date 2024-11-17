import { NextResponse } from 'next/server'
import { parseInput, TruthTable, ForwardChaining, BackwardChaining } from '@/lib/inference'

export async function POST(req: Request) {
    const { input, method } = await req.json()
    const { kb, query } = parseInput(input)

    let result
    switch (method) {
        case 'TT':
            result = TruthTable(kb, query)
            break
        case 'FC':
            result = ForwardChaining(kb, query)
            break
        case 'BC':
            result = BackwardChaining(kb, query)
            break
        default:
            return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
    }

    return NextResponse.json({ result })
}