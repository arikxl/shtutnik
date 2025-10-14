/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback } from 'react'

import QuestionLoader from './QuestionLoader';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { QuizQuestionHandle } from '@/types/types';
import { useMutation } from '@tanstack/react-query';
import { updateTurn } from '@/app/api/quiz-create-question/game';

interface QuizQuestionProps {
    isSoundOn: boolean;
    questionsCount: number;
    setQuestionsCount: (updater: (count: number) => number) => void;
    advanceLevelMutation: () => void;
    changeTurnMutation: () => void;
    isAdvancingLevel: boolean;
    isQLoading: boolean;
    setIsQLoading: (value: boolean) => void;
    level: number;
}


const QuizQuestion = forwardRef<QuizQuestionHandle, QuizQuestionProps>((
    { level, changeTurnMutation, isQLoading, setIsQLoading, isAdvancingLevel,
        isSoundOn, setQuestionsCount, advanceLevelMutation },
    ref) => {

    const [question, setQuestion] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const lastSpokenQuestionRef = useRef<string | null>(null);
    const { speak } = useTextToSpeech();

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);




    const getNewQuestion = useCallback(async () => {
        setIsQLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/quiz-create-question', { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to fetch question from the server.');
            }
            const data = await response.json();
            setQuestion(data.question);
            if (level !== 3) {
                setQuestionsCount((currentCount: number) => {
                    let newCount = currentCount + 1;
                    if (newCount === 11) {
                        advanceLevelMutation();
                        changeTurnMutation()
                        newCount = 0;
                    }
                    return newCount;
                });
            } else {
                setQuestionsCount((currentCount: number) => {
                    let newCount = currentCount + 1;
                    console.log(newCount)
                    console.log(level)
                    if (newCount === 20) {
                        advanceLevelMutation();
                        newCount = 0;
                    }
                    return newCount;
                });
                changeTurnMutation()
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsQLoading(false);
        }
    }, [setIsQLoading, setQuestionsCount, advanceLevelMutation, changeTurnMutation, level]);

    useEffect(() => {
        if (!isClient) return;

        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };

        // ודא שהאובייקט קיים לפני השימוש בו
        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }

        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = null;
                window.speechSynthesis.cancel();
            }
        };
    }, [isClient]);

    useEffect(() => {
        if (question && voices.length > 0 && question !== lastSpokenQuestionRef.current && isSoundOn) {
            speak(question, isSoundOn);
            lastSpokenQuestionRef.current = question;
        }
    }, [question, isSoundOn, speak, voices.length, isClient]);


    useEffect(() => {
        if (!question || isQLoading) {
            return;
        }
        const timerId = setTimeout(() => {
            getNewQuestion();
        }, 6000);
        return () => {
            clearTimeout(timerId);
        };
    }, [question, isQLoading, getNewQuestion]);

    useImperativeHandle(ref, () => ({
        getNewQuestion
    }));

    return (
        <div>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {question && (
                <div>
                    <p>{isQLoading || isAdvancingLevel ? <QuestionLoader /> : question}</p>
                </div>
            )}
        </div>
    );
});

QuizQuestion.displayName = 'QuizQuestion';
export default QuizQuestion;