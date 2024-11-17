import { NextResponse } from 'next/server'
import * as pdfjsLib from 'pdfjs-dist'

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
        let content = ''

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            content += textContent.items.map((item: any) => item.str).join(' ')
        }

        return NextResponse.json({ content })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to parse PDF' },
            { status: 500 }
        )
    }
}