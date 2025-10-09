import { exampleQuestions } from '@/utils/utils';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {

   
        const examplesAsText = exampleQuestions.map((q, index) => `${index + 1}. ${q}`).join('\n');

        const finalPrompt = `אתה עוזר ביצירת שאלות טריוויה בעברית  .

        אלו הן דוגמאות לסגנון השאלות שאני מחפש:
        ${examplesAsText}

        עכשיו, בהתבסס על הדוגמאות, צור שאלה אחת בלבד מקורית באותו הסגנון. ודא שהיא בעברית ומבוססת על עובדות אמיתיות.
       אפשר גם שאלות של שלילה. למשל "מהי לא עיר הבירה של ספרד?" או "תן שם של שיר לא של שלמה ארצי".
        תן רק את השאלה. בלי שום הקדמה או סיום . 
        במידה ואתה נותן מספר שאלות, תביא רק את הראשונה!!
        `;

        const MODEL_NAME = "gemini-2.0-flash-lite";
        const API_KEY = process.env.GOOGLE_API_KEY;

        const url = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

        const requestBody = {
            "contents": [{
                "parts": [{
                    "text": finalPrompt
                }]
            }]
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Google API Error:", errorData);
            // It's better to return a proper response object here
            return NextResponse.json({ error: `API Error: ${response.status} ${JSON.stringify(errorData)}` }, { status: response.status });
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
            return NextResponse.json({ error: "Invalid response structure from Google API" }, { status: 500 });
        }

        const questionContent = data.candidates[0].content.parts[0].text;

        return NextResponse.json({ question: questionContent });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
    }
}