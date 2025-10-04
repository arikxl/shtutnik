/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'

const QuizQuestion = () => {
    const [question, setQuestion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getNewQuestion = async () => {
        setIsLoading(true);
        setError(null);
        setQuestion(null);

        try {
            // Call your own secure back-end route
            const response = await fetch('/api/quiz-create-question', {
                method: 'POST',
            });

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
        
  return (
      <div>
          <button onClick={getNewQuestion} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Get New Question'}
          </button>

          {error && <p style={{ color: 'red' }}>Error: {error}</p>}

          {question && (
              <div >
                  <p>{question}</p>
              </div>
          )}
      </div>
  )
}

export default QuizQuestion