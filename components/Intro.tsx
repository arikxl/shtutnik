'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import PlayersNames from './PlayersNames'


const Intro = () => {


    const [isStartPressed, setIsStartPressed] = useState(false);

    return (
        
          !isStartPressed 
              ? (
                  <div className="w-full flex flex-col items-center h-full ">


                      <h1 className="mt-10 text-7xl font-bold">שטותניק</h1>
                      <Link href={'/https://www.linkedin.com/in/arik-alexandrov/'}>
                          <p className="hover:underline mt-[-15px] mb-18">arikxl</p>
                      </Link>

                      <Image src='/logo.png' alt='Arik Alexandrov'
                          width={300} height={200}
                          className=""
                      />
                      <p className="mt-[-90] mb-24">
                          מחווה לחרטטוני של&nbsp;
                          <Link className=' font-bold' target='_blank'
                              href={'https://www.youtube.com/playlist?list=PLEuMzKiu1RQAYhLIDg6uh6j2eomOFABGJ'}>דונקי</Link>
                          .
                      </p>


                      <button onClick={()=>setIsStartPressed(true)}
                          className="mb-6 bg-white text-xl py-2 w-1/2 rounded-lg  cursor-pointer "
                      >
                          משחק חדש
                      </button>

                      <Link href={'/instructions'} className='w-1/2'>
                          <button
                              className="bg-white text-xl py-2 w-full rounded-lg cursor-pointer "
                          >
                              להוראות המשחק
                          </button>
                      </Link>

                  </div>
        )
              : (
                  <PlayersNames />
              )
      
   
  )
}

export default Intro