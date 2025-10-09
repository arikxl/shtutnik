/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { QuizQuestionHandle } from '@/types/types';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import QuestionLoader from './QuestionLoader';

interface QuizQuestionProps {
    isSoundOn: boolean;
}


const QuizQuestion = forwardRef<QuizQuestionHandle, QuizQuestionProps>(({ isSoundOn }, ref) => {
    const [question, setQuestion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const lastSpokenQuestionRef = useRef<string | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);



    const getNewQuestion = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/quiz-create-question', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to fetch question from the server.');
            }
            const data = await response.json();
            setQuestion(data.question);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getNewQuestion();

        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };

        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices(); 

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
            window.speechSynthesis.cancel();
        };
    }, []);

    useEffect(() => {
        if (question && voices.length > 0 && question !== lastSpokenQuestionRef.current && isSoundOn) {
            handleSpeak(question);
            lastSpokenQuestionRef.current = question;
        }
    }, [question, voices, isSoundOn]);

    useImperativeHandle(ref, () => ({
        getNewQuestion
    }));



    const handleSpeak = (text: string) => {
        if (!isSoundOn) return;

        if (!('speechSynthesis' in window)) {
            console.log("הדפדפן שלך לא תומך בהקראת טקסט.");
            return;
        }

        window.speechSynthesis.cancel();

        utteranceRef.current = new SpeechSynthesisUtterance(text);
        utteranceRef.current.lang = 'he-IL';

        const hebrewVoice = voices.find(voice => voice.lang === 'he-IL');
        if (hebrewVoice && utteranceRef.current) {
            utteranceRef.current.voice = hebrewVoice;
        } else {
            console.warn("לא נמצא קול בעברית, ייתכן שימוש בקול ברירת המחדל.");
        }

        if (utteranceRef.current) {
            window.speechSynthesis.speak(utteranceRef.current);
        }
    };

    return (
        <div>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {question && (
                <div>
                    <p>{isLoading ? <QuestionLoader/> : question}</p>
                </div>
            )}
        </div>
    );
});

QuizQuestion.displayName = 'QuizQuestion';
export default QuizQuestion;