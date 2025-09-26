/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation';
import React from 'react'


const fetchUser = async (gameId : number) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${gameId}`);
    if (!res.ok) return null;
    const user = res.json();
    return user
}


const GameDynamic = async ({ params }: any) => {
    
    const { gameId } = await params;
    
    // const response = await fetch(`https://jsonplaceholder.typicode.com/users/${gameId}`);
    // const user = await response.json();
    const user = await fetchUser(gameId);


    if(!user) notFound()

  return (
      <div>
          
          <h1>Game {gameId}</h1>

          <p>name: { user.name}</p>
          <p>email: { user.email}</p>
      </div>
  )
}

export default GameDynamic