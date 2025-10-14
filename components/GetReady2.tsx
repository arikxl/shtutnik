import React from 'react'

const GetReady2 = ({ game, onStart }) => {
    return (


        <div className='flex flex-col items-center h-full justify-around text-2xl text-center'>
            <h1 className='text-4xl'>
                <span className='underline ml-2'>{game?.player1_name}</span>
                ו
                <span className='underline ml-2'>{game?.player2_name}</span>

            </h1>
            <h2 className='text-3xl'>ברוכים הבאים לשלב המהיר!</h2>

            <div>
                <h3>יש לכם 20 שאלות</h3>
                <h3>5 שניות לכל שאלה</h3>
                <h3 className='font-bold'>התור מתחלף אחרי כל שאלה</h3>
            </div>
            <h2>לוחצים על הכפתור הירוק רק אם החרטוט מוצלח!</h2>

            <button

                onClick={onStart}
                className="mb-6 bg-white text-xl py-2 w-7/10 rounded-lg cursor-pointer "
            >
                הבה נמשיך
            </button>
        </div>
    )
}

export default GetReady2