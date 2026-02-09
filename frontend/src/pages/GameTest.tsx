import { useEffect, useRef, useState } from 'react'
import { Fullscreen, Minimize } from 'lucide-react'

import sdkCode from '/src/assets/sdk.js?raw'
import { stripHtmlCodeTags } from '../components/AppPreview/AppPreview'
import { useGameBuilder } from '../contexts/GameBuilderContext'

const Page = () => {
  const gameIFrameRef = useRef<HTMLIFrameElement>(null)
  const { initializeGame, gameCode } = useGameBuilder()
  const gameId = window.location.pathname.split('/').pop()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isMobile =
    typeof navigator !== 'undefined' &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const [iframeHeight, setIframeHeight] = useState(
    isMobile ? '100vh' : '560px'
  )

  useEffect(() => {
    if (gameId) {
      console.log('Initializing game with ID:', gameId)
      initializeGame(parseInt(gameId), { unauthenticated: true })
    }
  }, [gameId])

  if (!/^[0-9]+$/.test(gameId)) {
    return <p>Invalid game ID</p>
  }

  const handleIframeLoad = () => {
    const iframe = gameIFrameRef.current
    const iframeDocument = iframe?.contentDocument
    if (!iframe || !iframeDocument || iframeDocument.readyState !== 'complete') {
      return
    }

    if (isMobile && !isFullscreen) {
      setIframeHeight('100vh')
      return
    }

    const height = Math.max(
      iframeDocument.body?.scrollHeight ?? 0,
      iframeDocument.documentElement?.scrollHeight ?? 0
    )
    if (height > 0) {
      setIframeHeight(`${height}px`)
    }
  }

  const requestFullscreen = (enter: boolean) => {
    const iframe = gameIFrameRef.current
    if (!iframe) return

    if (enter) {
      if (isMobile) {
        setIframeHeight('100vh')
      }

      if (iframe.requestFullscreen) {
        iframe.requestFullscreen()
      } else if ((iframe as any).webkitRequestFullscreen) {
        ;(iframe as any).webkitRequestFullscreen()
      }
    } else {
      if (isMobile && iframe.contentDocument) {
        const height = Math.max(
          iframe.contentDocument.body?.scrollHeight ?? 0,
          iframe.contentDocument.documentElement?.scrollHeight ?? 0
        )
        if (height > 0) {
          setIframeHeight(`${height}px`)
        }
      }

      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if ((document as any).webkitExitFullscreen) {
        ;(document as any).webkitExitFullscreen()
      }
    }
  }

  const toggleScreenmode = () => {
    if (isFullscreen) {
      requestFullscreen(false)
      setIsFullscreen(false)
    } else {
      requestFullscreen(true)
      setIsFullscreen(true)
    }
  }

  return (
    <div className="relative">
      {isFullscreen ? (
        <Minimize
          className="absolute bottom-5 right-5 cursor-pointer text-white/50 hover:text-white transition-all duration-500 z-10"
          size={32}
          onClick={() => toggleScreenmode()}
        />
      ) : (
        <Fullscreen
          className="absolute bottom-5 right-5 cursor-pointer text-white/50 hover:text-white transition-all duration-500 z-10"
          size={32}
          onClick={() => toggleScreenmode()}
        />
      )}
      <iframe
        id="gameCanvas"
        ref={gameIFrameRef}
        srcDoc={`<script>${sdkCode}</script>${stripHtmlCodeTags(gameCode)}`}
        className="flex w-full"
        style={{ height: iframeHeight }}
        sandbox="allow-scripts allow-same-origin"
        title="Game Preview"
        allowFullScreen
        onLoad={handleIframeLoad}
      />
    </div>
  )
}

export default Page
