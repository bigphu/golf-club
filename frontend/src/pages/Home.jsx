import React from 'react'

import homeBackground from '../assets/home-background.png'

const Home = () => {
  return (
    <>
      <div className='col-start-3 col-span-3 flex flex-col items-start justify-center gap-4'>
        <div className='text-txt-primary text-8xl font-outfit font-extrabold'>
          GOLF <br></br>
          CLUB <br></br>
          MANAGER <br></br>
        </div>

        <div className='text-txt-accent font-roboto font-medium text-sm'>
          <span>
            Manage tournaments, view official club documents, and connect with other members seamlessly.
          </span>
        </div>

      </div>

      <div className='col-start-7 col-span-6 flex flex-col items-start justify-center'>
        <img className='bg-cover w-full h-full' src={homeBackground} alt="Golf Club Home"></img>
      </div>
    </>
  )
}

export default Home