import { proxyActivities, defineSignal, setHandler, sleep } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';




const SONGS = [
  {
    name: ['Super Mario', 'Mario'],
    time: 0
  },
  {
    name: ['Cuphead', 'Cup Head'],
    time: 16
  },
  {
    name: ['Zelda', 'Legend of Zelda'],
    time: 32
  },
  {
    name: ['Uncharted'],
    time: 48
  },
  {
    name: ['Papers Please'],
    time: 64
  },
  {
    name: ['Doom'],
    time: 80
  },
  {
    name: ['Donkey Kong'],
    time: 96
  },
  {
    name: ['Silent Hill'],
    time: 112
  },
  {
    name: ['Stardew Valley', 'Stardew'],
    time: 127
  },
  {
    name: ['Metal Gear', 'Metal Gear'],
    time: 143
  },
  {
    name: ['Pokemon'],
    time: 159
  },
  {
    name: ["Baldur's Gate", 'Baldurs Gate'],
    time: 174
  },
  {
    name: ['F-Zero', 'F Zero', 'fzero'],
    time: 190
  },
  {
    name: ['Mario', 'Super Mario'],
    time: 206
  },
  {
    name: ['God of War'],
    time: 222
  },
  {
    name: ['Wario', 'Wario Land'],
    time: 238
  },
  {
    name: ['Witcher', 'The Witcher'],
    time: 253
  },
  {
    name: ['Banjo Kazooie', 'Banjo-Kazooie'],
    time: 269
  },
  {
    name: ['Captain Toad'],
    time: 285
  },
  {
    name: ['Hearthstone'],
    time: 301
  }
]

const { greet } = proxyActivities<typeof activities>({
  startToCloseTimeout: '6 minute',
});


/** A workflow that simply calls an activity */
export async function game({ index }: { index: number }): Promise<string> {
  const guessSignal = defineSignal<[string]>('client-guess');
  const terminateSignal = defineSignal<[string]>('client-terminate');

  console.log('example workflow started');
  let counter = 0
  let message = ''
  let correctPlayer = ""

  setHandler(guessSignal, (payload: any) => {
    const { name, song } = payload
    console.log('guess signal received', name, song);
    if (SONGS[index].name.map((song) => {
      return song.toLowerCase()
    }).includes(song.toLowerCase())) {
      correctPlayer = name
      message = `Correct! ${name} guessed ${SONGS[index].name.join(', ')}`
    }
    // do something with the signal data
  });

  setHandler(terminateSignal, () => {
    counter = 60 * 9999
    message = 'Game terminated'
  });

  while (counter < 60 * 2 && correctPlayer == "") {
    console.log('Waiting', counter, message, index);
    counter++;
    await sleep(1000)
  }

  return await greet(correctPlayer);
}
