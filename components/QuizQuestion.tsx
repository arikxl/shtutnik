/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'

import QuestionLoader from './QuestionLoader';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { QuizQuestionHandle } from '@/types/types';

interface QuizQuestionProps {
    isSoundOn: boolean;
    questionsCount: number;
    setQuestionsCount: (updater: (count: number) => number) => void;
    advanceLevelMutation: () => void;
    isAdvancingLevel: boolean;
}


const QuizQuestion = forwardRef<QuizQuestionHandle, QuizQuestionProps>(({ isAdvancingLevel, isSoundOn, questionsCount, setQuestionsCount, advanceLevelMutation }, ref) => {
    const [question, setQuestion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const lastSpokenQuestionRef = useRef<string | null>(null);

    const { speak } = useTextToSpeech();


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

            setQuestionsCount((currentCount: number) => {
                let newCount = currentCount + 1;
                if (newCount === 11) {
                    advanceLevelMutation();
                    newCount = 0;
                }
                return newCount;
            });

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // getNewQuestion();
        
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
            speak(question, isSoundOn);
            lastSpokenQuestionRef.current = question;
        }
    }, [question, isSoundOn, speak, voices.length]);
    
    useImperativeHandle(ref, () => ({
        getNewQuestion
    }));
    
    
    // console.log(questionsCount)
    return (
        <div>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {question && (
                <div>
                    <p>{isLoading || isAdvancingLevel ? <QuestionLoader/> : question}</p>
                </div>
            )}
        </div>
    );
});

QuizQuestion.displayName = 'QuizQuestion';
export default QuizQuestion;