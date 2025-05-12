import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'

const SONG_LENGTH = 9 // seconds
const SECTION_LENGTH = 15 // seconds
const MAX_PLAYBACK_RATE = 15
const MIN_PLAYBACK_RATE = 1

const SONGS = [
  {
    time: 0
  },
  {
    time: 16
  },
  {
    time: 32
  },
  {
    time: 48
  },
  {
    time: 64
  },
  {
    time: 80
  },
  {
    time: 96
  },
  {
    time: 112
  },
  {
    time: 127
  },
  {
    time: 143
  },
  {
    time: 159
  },
  {
    time: 174
  },
  {
    time: 190
  },
  {
    time: 206
  },
  {
    time: 222
  },
  {
    time: 238
  },
  {
    time: 253
  },
  {
    time: 269
  },
  {
    time: 285
  },
  {
    time: 301
  }
]

const Main = () => {
  const videoPlayerRef = useRef<ReactPlayer>(null)
  const songIndexRef = useRef(0)
  const [status, setStatus] = useState<
    'loading' | 'start' | 'waiting' | 'playing' | 'guessed'
  >('loading')
  const [correctPlayer, setCorrectPlayer] = useState('')

  const [currentPlaybackRate, setCurrentPlaybackRate] =
    useState(MAX_PLAYBACK_RATE)

  const handlePlay = () => {
    setStatus('playing')
  }

  const correctGuess = (name: string) => {
    setCorrectPlayer(name)
    setStatus('guessed')
    setCurrentPlaybackRate(1)
  }

  const startRound = () => {
    setCorrectPlayer('')
    fetch(`http://localhost:4321/api?index=${songIndexRef.current}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        if (data.status === 'success') {
          console.log('Data received:', data.data)
          correctGuess(data.data)
        } else {
          console.error('Error:', data.message)
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
    setStatus('playing')
  }

  useEffect(() => {
    if (
      songIndexRef.current >= 0 &&
      !['loading', 'start', 'guessed'].includes(status)
    ) {
      console.log('Starting round for song index:', songIndexRef.current)
      startRound()
    }
  }, [songIndexRef.current, status])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ReactPlayer
        ref={videoPlayerRef}
        url='http://localhost:4321/music.mp4'
        playbackRate={currentPlaybackRate}
        width='100%'
        height='100%'
        controls={true}
        playing={['waiting', 'playing', 'guessed'].includes(status)}
        loop={false}
        onReady={() => {
          if (status === 'loading') {
            setStatus('start')
          }
        }}
        progressInterval={1}
        onProgress={(state) => {
          if (videoPlayerRef.current) {
            if (state.playedSeconds === 0) {
              videoPlayerRef.current.seekTo(SONGS[songIndexRef.current].time)
              return
            }
            if (
              state.playedSeconds >
              SONGS[songIndexRef.current].time + SONG_LENGTH
            ) {
              if (currentPlaybackRate > MIN_PLAYBACK_RATE) {
                setCurrentPlaybackRate(currentPlaybackRate - 0.5)
                videoPlayerRef.current.seekTo(SONGS[songIndexRef.current].time)
              } else {
                if (
                  state.playedSeconds >
                  SONGS[songIndexRef.current].time + SECTION_LENGTH
                ) {
                  setStatus('waiting')
                  setCorrectPlayer('')
                  songIndexRef.current += 1
                  setCurrentPlaybackRate(MAX_PLAYBACK_RATE)
                  videoPlayerRef.current.seekTo(
                    SONGS[songIndexRef.current].time
                  )
                }
              }
            }
          }
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          justifyContent: 'center',
          alignItems: 'center',
          display: status === 'start' ? 'flex' : 'none'
        }}
      >
        <button
          style={{
            backgroundColor: 'blue',
            color: 'white',
            padding: '10px 20px',
            fontSize: '20px',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 10
          }}
          onClick={handlePlay}
        >
          Click here to Start
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          justifyContent: 'center',
          alignItems: 'center',
          display: correctPlayer !== '' ? 'flex' : 'none'
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: '64px',
            textAlign: 'center',
            marginTop: '-150px',
            filter: 'drop-shadow(0 0 5px black)'
          }}
        >
          Correct Player: {correctPlayer}
        </h1>
      </div>
      <div
        style={{
          position: 'absolute',
          top: '4vh',
          right: '4vh',
          display: ['waiting', 'playing', 'guessed'].includes(status)
            ? 'flex'
            : 'flex'
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: '32px',
            textAlign: 'right',
            filter: 'drop-shadow(0 0 5px black)'
          }}
        >
          Current Song Speed: {currentPlaybackRate * 100}%
        </h1>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div id='app'>
      <Main />
    </div>
  )
}
