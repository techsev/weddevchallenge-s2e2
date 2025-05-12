import { useState, useRef } from 'react'

const Join = () => {
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('abcd')
  const [error, setError] = useState('')
  const [guess, setGuess] = useState('')
  const [state, setState] = useState<'join' | 'joining' | 'playing'>('join')

  const handleJoin = () => {
    setError('')
    if (name.trim() === '' || roomCode.trim() === '') {
      setError('Please enter both name and room code.')
      return
    }
    // Handle join logic here
    setState('playing')
    console.log(`Joining room ${roomCode} as ${name}`)
  }

  const handleGuess = () => {
    if (guess.trim() === '') {
      setError('Please a guess')
      return
    }
    // Handle join logic here
    fetch(`http://localhost:4321/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        song: guess
      })
    })
    setGuess('')
    console.log(`Joining room ${roomCode} as ${name}`)
  }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col items-center justify-center '>
      {state === 'joining' && (
        <div className='flex flex-col items-center justify-center'>
          <h1>Joining...</h1>
          <p>Please wait while we connect you to the room.</p>
        </div>
      )}
      {state === 'playing' && (
        <div className='flex flex-col items-center justify-center'>
          <div className='w-full max-w-xs'>
            <h1>Send Your Guess</h1>
            <label
              className='block text-gray-700 text-sm font-bold mb-2'
              htmlFor='username'
            >
              Game Series (1-3 words)
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              name='name'
              type='text'
              placeholder='Enter your Guess'
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
              onClick={handleGuess}
            >
              Send Guess
            </button>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
      {state === 'join' && (
        <div className='w-full max-w-xs'>
          <h1>Join a Room</h1>
          <label
            className='block text-gray-700 text-sm font-bold mb-2'
            htmlFor='username'
          >
            Name
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            name='name'
            type='text'
            placeholder='Enter your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            onClick={handleJoin}
          >
            Join
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}

export default Join
