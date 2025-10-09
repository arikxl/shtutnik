import { useState, useEffect, useCallback } from 'react';


export const useTextToSpeech = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    useEffect(() => {
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

 
    const speak = useCallback((text: string, isSoundOn: boolean) => {
        if (!isSoundOn || !text) return;

        if (!('speechSynthesis' in window)) {
            console.log("הדפדפן שלך לא תומך בהקראת טקסט.");
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'he-IL';

        const hebrewVoice = voices.find(voice => voice.lang === 'he-IL');
        if (hebrewVoice) {
            utterance.voice = hebrewVoice;
        } else {
            console.warn("לא נמצא קול בעברית, ייתכן שימוש בקול ברירת המחדל.");
        }

        window.speechSynthesis.speak(utterance);

    }, [voices]);

    return { speak };
};


