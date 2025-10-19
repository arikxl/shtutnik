'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const AnimTitle = ({ text }) => {
    const titleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('span', {
                y: 100,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)',
                stagger: 0.05,
            });
        }, titleRef);

        return () => ctx.revert();
    }, []);

    return (
        <h1 ref={titleRef} style={{ overflow: 'hidden' }}>
            {text.split('').map((char: string, index: number) => (
                <span
                    key={index}
                    style={{ display: 'inline-block' }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </h1>
    );
};

export default AnimTitle;