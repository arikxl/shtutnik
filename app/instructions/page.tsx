import Link from 'next/link'
import React from 'react'

const Instructions = () => {
  return (
    <div className="bg-red-400 mt-20 flex flex-col ">
      
      <h2 className='text-center text-4xl font-bold mb-10'>איך משחקים?</h2>
      <ul className='mb-10'>
        <li>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores sit dolores corporis perspiciatis porro cumque hic nihil cum rem facere aperiam assumenda expedita quaerat ipsa, qui doloremque aspernatur quidem mollitia!
        </li>
        <li>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores sit dolores corporis perspiciatis porro cumque hic nihil cum rem facere aperiam assumenda expedita quaerat ipsa, qui doloremque aspernatur quidem mollitia!
        </li>
        <li>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores sit dolores corporis perspiciatis porro cumque hic nihil cum rem facere aperiam assumenda expedita quaerat ipsa, qui doloremque aspernatur quidem mollitia!
        </li>
      </ul>

      <Link href={'/'} className='mx-auto'>
        <button
          className="bg-white px-4 cursor-pointer "
        >
         חזרה להתחלה
        </button>
      </Link>
 
    </div>
  )
}

export default Instructions