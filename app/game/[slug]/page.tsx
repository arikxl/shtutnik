/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import AnimTitle from '@/components/AnimTitle';
import Loader from '@/components/Loader';
import { supabase } from '@/supabase-client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import React from 'react'


const fetchGameById = async (slug: string) => {
    const { data, error } = await supabase.from("games").select("*").eq("slug", slug).single();
    if (error) throw new Error(error.message);
    return data;
}


const GameDynamic = () => {

    // const { slug } = params;
    const params = useParams();
    const slug = params.slug as string;

    const { data, error, isLoading } = useQuery({
        queryKey: ["game", slug],
        queryFn: () => fetchGameById(slug)
    })


    console.log(data)


    if (isLoading) return <Loader />

    if (error) return <div>Error: {error.message}</div>;


    if (!data && !isLoading) {
        notFound();
    }

    if (!data) return <Loader />;

    return (
        <div className='flex flex-col items-center py-20 space-y-6 px-6'>

            <h3 className='text-4xl'>
                {data.player1_name}
                <span className='text-xl'> נגד </span>
                {data.player2_name}
            </h3>

            <div className='text-6xl'>
                <AnimTitle text='ראש בראש'/>
            </div>

            <div className='mb-10'>
                <p className='text-sm'>
                    <strong>מטרה:</strong> לחרטט תשובה שגויה, אך באותה הקטגוריה.
                    <br />
                    <br />
                    <strong>שלב א&apos;:</strong> כל שחקן מקבל 10 שאלות אישיות ברצף.
                    <br />
                    <br />
                    <strong>שלב ב&apos;:</strong>  אחרי ששני השחקנים סיימו, עונים על 10 שאלות נוספות, כל פעם שחקן אחר (לסירוגין).
                    <br />
                    <br />
                    <strong>נקודות:</strong> לוחצים על הכפתור הירוק
                    &nbsp;
                    <strong className='text-center'>
                        רק אם התשובה  היא חרטוט מוצלח.
                    </strong>
                    <br />
                    <br />
                    אם התשובה נכונה/לא קשורה/אין תשובה - לא לוחצים!
                    <br />
                    <br />
                    לכל שאלה יש 5 שניות עד שהיא מוחלפת.
                    <br />
                    <br />
                    השאלות מיוצרות על ידי AI. אז לא לכעוס אם מופיעות שאלות לא הגיוניות או שפתאום השאלות חוזרות על עצמן.
                </p>
            </div>

            <Link href={`/quiz/${data.slug}`} className='w-full'>
                <button
                    className="bg-white text-xl py-2 w-full rounded-lg cursor-pointer "
                >
                    הבנו הכל
                </button>
            </Link>



        </div >
    )
}

export default GameDynamic