import React from 'react'

const GetReady1 = ({ player, onStart }) => {
    return (
        <div className='flex flex-col items-center h-full justify-around text-2xl text-center'>
            <h1 className='text-4xl'>
                <span className='underline ml-2'>{player}</span>
                עכשיו תורך
            </h1>
            <div>
            <h2>יש לך 10 שאלות ברצף</h2>
            <h2>5 שניות לכל שאלה</h2>
            </div>
            <h2>לוחצים על הכפתור הירוק רק אם החרטוט מוצלח!</h2>

            <button
                
                onClick={onStart}
                className="mb-6 bg-white text-xl py-2 w-7/10 rounded-lg cursor-pointer "
            >
                { 'הבה נתחיל'}

            </button>
        </div>
    )
}

export default GetReady1