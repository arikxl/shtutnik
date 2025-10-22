'use client'
import { UseMutateFunction } from "@tanstack/react-query";
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback } from 'react'

import QuestionLoader from './QuestionLoader';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { ApiError, QuizQuestionHandle } from '@/types/types';

interface QuizQuestionProps {
    advanceLevelMutation: UseMutateFunction<void, ApiError, void, unknown>;
    isSoundOn: boolean;
    questionsCount: number;
    setQuestionsCount: (updater: (count: number) => number) => void;
    changeTurnMutation: () => void;
    isAdvancingLevel: boolean;
    isQLoading: boolean;
    setIsQLoading: (value: boolean) => void;
    level: number;
    setIsReady: (value: boolean) => void;
}


const QuizQuestion = forwardRef<QuizQuestionHandle, QuizQuestionProps>((
    { level, changeTurnMutation, isQLoading, setIsQLoading, setIsReady,
        isSoundOn, setQuestionsCount, advanceLevelMutation, isAdvancingLevel },
    ref) => {

    const [error, setError] = useState<string | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [question, setQuestion] = useState<string | null>(null);

    const lastSpokenQuestionRef = useRef<string | null>(null);

    const { speak } = useTextToSpeech();

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
            if (level=== 1 || level===2) {
                setQuestionsCount((currentCount: number) => {
                    let newCount = currentCount + 1;
                    if (newCount === 11) {
                        advanceLevelMutation();
                        changeTurnMutation()
                        setIsReady(false)
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

        } catch (err: unknown) {
            const error = err instanceof Error ? err.message : "Unknown error";
            setError(error);

        } finally {
            setIsQLoading(false);
        }
    }, [setIsQLoading, level, setQuestionsCount, advanceLevelMutation, changeTurnMutation, setIsReady]);

    useEffect(() => {
        if (!isClient) return;

        const loadVoices = () => {
            setVoices(window.speechSynthesis.getVoices());
        };

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
                    {isQLoading || isAdvancingLevel ? <QuestionLoader /> : question}
                </div>
            )}
        </div>
    );
});

QuizQuestion.displayName = 'QuizQuestion';
export default QuizQuestion;