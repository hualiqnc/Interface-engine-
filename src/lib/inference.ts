type Clause = {
    antecedents: Expression[]
    consequent: Expression
}

type Expression = {
    type: 'LITERAL' | 'NEGATION' | 'DISJUNCTION' | 'BICONDITIONAL'
    value: string | Expression | Expression[]
}

type KnowledgeBase = {
    facts: Set<string>
    rules: Clause[]
}

function parseExpression(expr: string): Expression {
    expr = expr.trim()
    
    // Handle negation
    if (expr.startsWith('~')) {
        return {
            type: 'NEGATION',
            value: parseExpression(expr.slice(1))
        }
    }
    
    // Handle disjunction
    if (expr.includes('||')) {
        return {
            type: 'DISJUNCTION',
            value: expr.split('||').map(e => parseExpression(e.trim()))
        }
    }
    
    // Handle biconditional
    if (expr.includes('<=>')) {
        const [left, right] = expr.split('<=>').map(e => parseExpression(e.trim()))
        return {
            type: 'BICONDITIONAL',
            value: [left, right]
        }
    }
    
    // Simple literal
    return {
        type: 'LITERAL',
        value: expr
    }
}

export function parseInput(input: string): { kb: KnowledgeBase; query: string } {
    const lines = input.split('\n')
    const kb: KnowledgeBase = { facts: new Set(), rules: [] }
    let query = ''

    let isTell = false
    let isAsk = false

    for (const line of lines) {
        if (line.trim() === 'TELL') {
            isTell = true
            continue
        } else if (line.trim() === 'ASK') {
            isTell = false
            isAsk = true
            continue
        }

        if (isTell) {
            const clauses = line.split(';').map((c) => c.trim()).filter((c) => c)
            for (const clause of clauses) {
                if (clause.includes('=>')) {
                    const [antecedentsStr, consequentStr] = clause.split('=>').map((s) => s.trim())
                    const antecedents = antecedentsStr.split('&').map((s) => parseExpression(s.trim()))
                    const consequent = parseExpression(consequentStr)
                    kb.rules.push({ antecedents, consequent })
                } else {
                    // Handle facts with new operators
                    const expr = parseExpression(clause)
                    if (expr.type === 'LITERAL') {
                        kb.facts.add(expr.value as string)
                    } else {
                        kb.rules.push({ antecedents: [], consequent: expr })
                    }
                }
            }
        } else if (isAsk) {
            query = line.trim()
        }
    }

    return { kb, query }
}

function evaluateExpression(expr: Expression, assignment: Record<string, boolean>): boolean {
    switch (expr.type) {
        case 'LITERAL':
            return assignment[expr.value as string] || false
            
        case 'NEGATION':
            return !evaluateExpression(expr.value as Expression, assignment)
            
        case 'DISJUNCTION':
            return (expr.value as Expression[]).some(e => evaluateExpression(e, assignment))
            
        case 'BICONDITIONAL':
            const [left, right] = expr.value as Expression[]
            const leftValue = evaluateExpression(left, assignment)
            const rightValue = evaluateExpression(right, assignment)
            return leftValue === rightValue
            
        default:
            return false
    }
}

function evaluateKB(kb: KnowledgeBase, assignment: Record<string, boolean>): boolean {
    // Evaluate facts
    for (const fact of kb.facts) {
        if (!assignment[fact]) return false
    }

    // Evaluate rules
    for (const rule of kb.rules) {
        const antecedentsTrue = rule.antecedents.every(ant => 
            evaluateExpression(ant, assignment)
        )
        const consequentTrue = evaluateExpression(rule.consequent, assignment)
        
        if (antecedentsTrue && !consequentTrue) {
            return false
        }
    }

    return true
}

export function TruthTable(kb: KnowledgeBase, query: string): string {
    const symbols = new Set<string>()
    kb.facts.forEach(fact => symbols.add(fact))
    kb.rules.forEach(rule => {
        rule.antecedents.forEach(ant => {
            if (ant.type === 'LITERAL') symbols.add(ant.value as string)
        })
        if (rule.consequent.type === 'LITERAL') symbols.add(rule.consequent.value as string)
    })
    symbols.add(query)

    const symbolList = Array.from(symbols)

    function generateTruthTable(n: number): boolean[][] {
        if (n === 0) return [[]]
        const subTable = generateTruthTable(n - 1)
        return [...subTable.map(row => [false, ...row]), ...subTable.map(row => [true, ...row])]
    }

    const table = generateTruthTable(symbolList.length)
    let modelCount = 0
    let totalModels = 0

    for (const row of table) {
        const assignment = Object.fromEntries(symbolList.map((sym, i) => [sym, row[i]]))
        if (evaluateKB(kb, assignment)) {
            totalModels++
            if (assignment[query]) {
                modelCount++
            }
        }
    }

    return modelCount > 0 ? `YES: ${modelCount}` : 'NO'
}

function isHornClause(rule: Clause): boolean {
    // A Horn clause can only have one positive literal (consequent)
    // All antecedents must be positive literals
    return rule.antecedents.every(ant => 
        ant.type === 'LITERAL' && 
        typeof ant.value === 'string'
    ) && 
    rule.consequent.type === 'LITERAL' && 
    typeof rule.consequent.value === 'string'
}

function isHornKB(kb: KnowledgeBase): boolean {
    // Check if all rules are Horn clauses
    return kb.rules.every(isHornClause)
}

export function ForwardChaining(kb: KnowledgeBase, query: string): string {
    // First check if KB is in Horn form
    if (!isHornKB(kb)) {
        return "NO: Knowledge base is not in Horn form. Use Truth Table method instead."
    }

    const entailed = new Set(kb.facts)
    const agenda = [...kb.facts]
    const steps: string[] = []
    let stepCount = 1

    // Check if query is in initial facts
    if (entailed.has(query)) {
        return `YES: ${[...entailed].join(', ')}\n\nReasoning:\nQuery '${query}' was found in initial facts.`
    }

    while (agenda.length > 0) {
        const p = agenda.pop()!
        steps.push(`${stepCount}. Examining fact: ${p}`)
        stepCount++

        if (p === query) {
            return `YES: ${[...entailed].join(', ')}\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nStarting from initial facts, we applied Horn rules to derive new facts until we found '${query}'.`
        }

        // Try to derive new facts using Horn rules
        for (const rule of kb.rules) {
            const consequentValue = rule.consequent.value as string
            
            if (consequentValue === query && entailed.has(query)) {
                continue
            }

            // Check if all antecedents are satisfied
            if (rule.antecedents.every(ant => entailed.has(ant.value as string)) && 
                !entailed.has(consequentValue)) {
                entailed.add(consequentValue)
                agenda.push(consequentValue)
                steps.push(`${stepCount}. Applied Horn rule: ${rule.antecedents.map(a => a.value).join(' & ')} => ${consequentValue}`)
                stepCount++

                if (consequentValue === query) {
                    return `YES: ${[...entailed].join(', ')}\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nStarting from initial facts, we applied Horn rules to derive new facts until we found '${query}'.`
                }
            }
        }
    }

    return `NO\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nAfter exhausting all possible Horn rule inferences, we could not derive '${query}'.`
}

export function BackwardChaining(kb: KnowledgeBase, query: string): string {
    // First check if KB is in Horn form
    if (!isHornKB(kb)) {
        return "NO: Knowledge base is not in Horn form. Use Truth Table method instead."
    }

    const entailed = new Set<string>()
    const steps: string[] = []
    let stepCount = 1

    function backchain(goal: string, visited: Set<string>): boolean {
        if (visited.has(goal)) {
            steps.push(`${stepCount++}. Skipping ${goal} (already visited)`)
            return false
        }
        visited.add(goal)
        steps.push(`${stepCount++}. Attempting to prove Horn clause goal: ${goal}`)

        if (kb.facts.has(goal)) {
            steps.push(`${stepCount++}. Found ${goal} in facts`)
            entailed.add(goal)
            return true
        }

        // Only consider Horn rules
        for (const rule of kb.rules) {
            if (rule.consequent.value === goal) {
                steps.push(`${stepCount++}. Found Horn rule: ${rule.antecedents.map(a => a.value).join(' & ')} => ${goal}`)
                if (rule.antecedents.every(ant => backchain(ant.value as string, new Set(visited)))) {
                    entailed.add(goal)
                    steps.push(`${stepCount++}. Successfully proved ${goal} using Horn rule`)
                    return true
                }
            }
        }

        steps.push(`${stepCount++}. Failed to prove ${goal} using Horn rules`)
        return false
    }

    const result = backchain(query, new Set())
    return result 
        ? `YES: ${[...entailed].join(', ')}\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nWorking backwards from the query '${query}', we successfully proved all required subgoals using Horn rules.`
        : `NO\n\nReasoning:\n${steps.join('\n')}\n\nExplanation:\nWorking backwards from '${query}', we could not establish a complete proof chain using Horn rules.`
}