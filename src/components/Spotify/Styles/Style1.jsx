import React from 'react'
import Time from '../utils/Time'
import Play from '../utils/Play'
import { Bwd, Fwd } from '../utils/StaticBtns'
import Shuffle from '../utils/Shuffle'
import Heart from '../utils/Heart'
function Style1() {
  return (
    <div className='center'>
      <div className="left"></div>
      <div className="middle d-center stack gap-4">
        <div className="photo d-center">
          <img className='rounded-2xl' src="https://picsum.photos/400" alt="" width={400} height={400}/>
        </div>
        <div className="actions d-center w-full !justify-evenly">
          <Shuffle/>
          <Bwd/>
          <Play/>
          <Fwd/>
          <Heart/>
        </div>
        <div className="time d-center w-full">
          <Time/>
        </div>
      </div>
      <div className="right"></div>
    </div>
  )
}

export default Style1