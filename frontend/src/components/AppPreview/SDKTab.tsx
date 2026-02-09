import '/src/assets/sdk.js'

import { Check, DownloadIcon, LoaderCircle } from 'lucide-react'

import { installSDK } from '../../lib/apiClient'
import { useGameBuilder } from '../../contexts/GameBuilderContext'
import { useState } from 'react'
import { Button } from '../Button'
import EventGeneratorTab from './EventGeneratorTab'

const steps = [
  'Waiting to install SDK...',
  'GameGPT SDK installation initiated!',
  'SDK successfully installed!',
]

const SDKTab = ({
  gameCode,
  setGameCode,
}: {
  gameCode: string
  setGameCode: (code: string) => void
}) => {
  const [installationStep, setInstallationStep] = useState(-1)
  const { sdkVersion } = useGameBuilder()

  const handleInstallSDK = async () => {
    setInstallationStep(1)
    const response = await installSDK(gameCode)
    setInstallationStep(2)
    setGameCode(response.code)
    setInstallationStep(3)
  }

  const currentVersion = window.gameGPT?.version || 0

  if (sdkVersion == currentVersion) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold my-4!">GameGPT SDK</h2>
        <p className="mb-2">
          The latest version of GameGPT SDK{' '}
          <span className="font-mono font-bold">v{sdkVersion}</span> is already
          integrated into your game code.
        </p>
        <p>
          For detailed documentation and code examples, please refer to our{' '}
          <a
            href="https://gamegpt.prism.ai/docs/sdk"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            official SDK documentation.
          </a>
        </p>
      </div>
    )
  }

  if (sdkVersion > 0 && sdkVersion < currentVersion) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold my-4!">GameGPT SDK</h2>
        <p className="mb-2">
          A newer version of GameGPT SDK{' '}
          <span className="font-mono font-bold">v{currentVersion}</span> is
          available. You currently have{' '}
          <span className="font-mono font-bold">v{sdkVersion}</span>{' '}
          integrated into your game code.
        </p>
        <p>
          For detailed documentation and code examples, please refer to our{' '}
          <a
            href="https://gamegpt.prism.ai/docs/sdk"
            className="text-blue-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            official SDK documentation.
          </a>
        </p>

        <div className="flex py-5 justify-center">
          <button className="rainbow-btn" onClick={() => handleInstallSDK()}>
            Update SDK
          </button>
        </div>

        {installationStep >= 0 && <StepperList completed={installationStep} />}
        <br />
        {installationStep === steps.length && (
          <p className="text-center text-sm text-green-500 font-semibold">
            GameGPT SDK has been integrated with your game code, review your
            changes under "Code" tab.
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="p-4! bg-[#FFFFFF0D] rounded-[16px] mt-2! border border-blue-500/20">
      <br />
      <br />
      <hr />
      <br />
      <br />
      <h2 className="text-2xl font-bold mb-4">GameGPT SDK</h2>
      <br />
      <br />
      <p className="mb-2">
        The <u>GameGPT SDK</u> is a required integration for all generated games
        prior to publication. It provides a unified set of core features across
        the entire platform, including:
      </p>
      <br />
      <ol className="list-decimal list-inside mb-4">
        <li>
          <u>Two primary game modes:</u> Wager Mode and Free Mode. These enable
          players to toggle between wager-based gameplay and free play, and also
          allow the platform to automatically select your game for tournaments.
        </li>
        <br />
        <li>
          <u>Leaderboard support</u> for recording player scores and managing
          both free and paid rankings.
        </li>
        <br />
        <li>
          <u>Standardized user authentication and session management</u> to
          ensure secure and consistent player experiences.
        </li>
      </ol>
      <br />
      <span>
        For detailed documentation and code examples, please refer to our{' '}
        <a
          href="https://gamegpt.prism.ai/docs/sdk"
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          official SDK documentation.
        </a>
      </span>

      <div className="flex pt-10! justify-center">
        <Button className='flex items-center gap-2 uppercase w-[250px]' onClick={() => handleInstallSDK()}>
          <DownloadIcon className='w-4 h-4' /> Install SDK
        </Button>
      </div>

      <br />
      <EventGeneratorTab gameCode={gameCode} setGameCode={setGameCode} />

      {installationStep >= 0 && <StepperList completed={installationStep} />}
      <br />
      {installationStep === steps.length && (
        <p className="text-center text-sm text-green-500 font-semibold">
          GameGPT SDK has been integrated with your game code, review your
          changes under "Code" tab.
        </p>
      )}
    </div>
  )
}

const StepperList = ({ completed }: { completed: number }) => {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-2">
          {completed <= index ? (
            <LoaderCircle className="animate-spin text-gray-400" />
          ) : (
            <Check color="purple" />
          )}
          <p
            className={`${completed > index ? 'text-white' : 'text-gray-800'}`}
          >
            {step}
          </p>
        </div>
      ))}
    </ol>
  )
}

export default SDKTab
