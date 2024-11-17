import { NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist';

// Hàm xử lý POST request
export async function POST(req: Request) {
    try {
        // Lấy dữ liệu từ request
        const formData = await req.formData();
        const file = formData.get('file') as File;

        // Kiểm tra nếu không có file được gửi
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Đọc file PDF từ arrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

        // Trích xuất nội dung từ từng trang
        let content = '';
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            content += textContent.items
                .map((item) => {
                    if ('str' in item) {
                        return item.str; // Chỉ lấy thuộc tính 'str' nếu tồn tại
                    }
                    return ''; // Nếu không phải TextItem, trả về chuỗi rỗng
                })
                .join(' ') + '\n';
        }

        // Trả về nội dung PDF
        return NextResponse.json({ content }, { status: 200 });
    } catch (error) {
        console.error('Error processing PDF:', error);

        // Xử lý lỗi và trả về response
        return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
    }
}
