import React from 'react'
import Loader from './Loader'

const Temp =( { game }) => {
  return (
      <div>
          Game level: {game?.level}
          <Loader />

          <div>
              <p>{game?.player1_name} {game?.player1_score}</p>
              <p>{game?.player2_name} {game?.player2_score}</p>
          </div>
    </div>
  )
}

export default Temp