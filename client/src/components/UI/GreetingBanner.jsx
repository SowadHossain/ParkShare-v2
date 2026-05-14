import { useState, useEffect, useCallback } from 'react'

export default function GreetingBanner({ name, onDone }) {
  const full = `Salam, ${name}.`
  const [displayed, setDisplayed] = useState('')
  const [fadingOut, setFadingOut] = useState(false)

  const finish = useCallback(() => {
    setFadingOut(true)
    setTimeout(onDone, 480)
  }, [onDone])

  useEffect(() => {
    let i = 0
    const tick = setInterval(() => {
      i++
      setDisplayed(full.slice(0, i))
      if (i >= full.length) {
        clearInterval(tick)
        setTimeout(finish, 1200)
      }
    }, 55)
    return () => clearInterval(tick)
  }, [full, finish])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink transition-opacity duration-500 ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="text-paper text-4xl md:text-6xl font-bold tracking-tight px-6 text-center">
        {displayed}
        <span className={`typewriter-cursor ml-0.5 ${displayed.length >= full.length ? 'opacity-0' : ''}`}>|</span>
      </div>
    </div>
  )
}
