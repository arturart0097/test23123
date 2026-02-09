import { fetchWithAuth, implementQuests, suggestQuests } from '../../lib/apiClient'

import PropagateLoader from 'react-spinners/PropagateLoader'
import toast from 'react-hot-toast'
import { useGameBuilder } from '../../contexts/GameBuilderContext'
import { useState } from 'react'

const EventGeneratorTab = ({
  gameCode,
  setGameCode,
}: {
  gameCode: string
  setGameCode: (code: string) => void
}) => {
  const [inputValue, setInputValue] = useState('')
  const [questDescriptions, setQuestDescriptions] = useState<string[]>([])
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false)
  const [implementingQuests, setImplementingQuests] = useState(false)
  const [questsImplemented, setQuestsImplemented] = useState(false)

  const { gameId, saveGame } = useGameBuilder()

  const getQuestSuggestions = async () => {
    setFetchingSuggestions(true)
    const response = await suggestQuests(gameCode)
    console.log('Quests response:', response)
    setQuestDescriptions(response)
    setFetchingSuggestions(false)
  }

  const updateGameCode = async () => {
    setImplementingQuests(true)
    const response = await implementQuests(gameCode, questDescriptions)
    setGameCode(response.code)
    setImplementingQuests(false)
    setQuestsImplemented(true)
  }

  const pushQuestsToArcade = async () => {
    if (gameId === -1 || questDescriptions.length === 0) {
      toast.error("Could not save quests to Arcade, please refill the descriptions and save again.")
      return
    }

    const arcadeBase = import.meta.env.VITE_ARCADE_BACKEND
    if (!arcadeBase) {
      throw new Error('VITE_ARCADE_BACKEND is not configured')
    }

    const res = await fetchWithAuth(`${arcadeBase}/api/quests/insert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, quests: questDescriptions }),
    })

    if (!res.ok) {
      throw new Error(`Quest insert failed: ${res.statusText}`)
    }
  }

  if (!gameCode.includes('window.gameGPT')) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold my-4!">Event Generator</h2>
        <p>
          The Event Generator requires the GameGPT SDK to be present in your
          game code. Please integrate the SDK first.
        </p>
      </div>
    )
  }

  if (gameCode.includes('window.gameGPT.emit("quest_completed"') || gameCode.includes("window.gameGPT.emit('quest_completed'")) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold my-4!">Event Generator</h2>
        <p>
          Quest system has already been integrated with this game. Currently GameGPT does not support editing or updated quest system via event generator.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold my-4!">Event Generator</h2>
      <p>
        Curate unique quests specific to your gameplay, either manually or use
        our Game Builder Engine to generate them.
      </p>
      <h3>Step 1. Write the descriptions</h3>
      {questDescriptions.map((desc, index) => (
        <div className="grid grid-cols-5 gap-2">
          <span className="col-span-4">{desc}</span>
          <button
            className="text-red-500 font-bold"
            onClick={() => {
              setQuestDescriptions((prev) => prev.filter((_, i) => i !== index))
            }}
          >
            X
          </button>
        </div>
      ))}
      {questDescriptions.length > 0 && <hr className="my-3!" />}
      {questDescriptions.length >= 5 && (
        <p className="text-sm! text-yellow-400 mb-2!">
          You have reached the maximum of 5 quests.
        </p>
      )}
      <div className="grid grid-cols-6 gap-3">
        <input
          type="text"
          placeholder="Enter quest description"
          className="text-sm! col-span-5!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="tiny-rainbow-btn"
          onClick={() => {
            setQuestDescriptions((prev) => [...prev, inputValue])
            setInputValue('')
          }}
          disabled={!inputValue.trim() || questDescriptions.length >= 5}
        >
          + Add
        </button>
      </div>
      <div className="flex py-5! justify-center">
        {fetchingSuggestions ? (
          <div className="my-3!">
            <PropagateLoader size={8} color="#8b5cf6" />
          </div>
        ) : (
          <button
            className="my-3! tiny-rainbow-btn"
            onClick={() => getQuestSuggestions()}
          >
            ✨ Suggest Quests
          </button>
        )}
      </div>
      <h3>Step 2. Implement quests inside the game</h3>
      {questsImplemented ? (
        <div className="text-center my-3! text-green-500">
          Quests have been successfully implemented! Review the changes in
          `code` tab and once confirmed, click Save Game.
        </div>
      ) : (
        <div className="text-center my-3! text-green-500">
          Click the button below to integrate the quests into your game code.
        </div>
      )}
      <div className="flex flex-col gap-3 py-5! justify-center">
        {questsImplemented ? (
          <button
            className="rainbow-btn"
            onClick={async () => {
              setImplementingQuests(true)
              try {
                await saveGame()
                await pushQuestsToArcade()
              } finally {
                setImplementingQuests(false)
              }
            }}
            disabled={implementingQuests}
          >
            Save Game
          </button>
        ) : (
          <button
            className="rainbow-btn"
            onClick={() => updateGameCode()}
            disabled={questDescriptions.length === 0 || implementingQuests}
          >
            Submit
          </button>
        )}
        {implementingQuests && (
          <div>
            <PropagateLoader size={8} color="#8b5cf6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default EventGeneratorTab
