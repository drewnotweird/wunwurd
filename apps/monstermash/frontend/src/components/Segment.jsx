import { useRef, useCallback, forwardRef, useImperativeHandle, useLayoutEffect } from 'react'

// Triangular prism: 3 faces, each 120° apart, rotating around X-axis.
// To show face N, the container must be at rotateX(-N * 120deg).

export default forwardRef(function Segment({ images, onDone, initialFace = 0 }, ref) {
  const prismRef = useRef()
  const windowRef = useRef()
  const initialAngle = -initialFace * 120
  const angleRef = useRef(initialAngle) // accumulated rotation in degrees

  // Set initial CSS transform synchronously before first paint so there's no
  // flash to face 0 when the previous arrangement should be showing.
  useLayoutEffect(() => {
    if (prismRef.current && initialAngle !== 0) {
      prismRef.current.style.transform = `rotateX(${initialAngle}deg)`
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const busyRef = useRef(false)

  // Hover tilt — applies perspective() in the transform so the rotation
  // has actual depth. Must go on windowRef, not on the prism-scene which
  // already owns the perspective property for its children.
  function handleMouseMove(e) {
    if (busyRef.current || !windowRef.current) return
    const rect = windowRef.current.getBoundingClientRect()
    const relY = (e.clientY - rect.top) / rect.height // 0 = top, 1 = bottom
    const tilt = (relY - 0.5) * 14 // ±7° max
    windowRef.current.style.transition = 'transform 0.12s ease-out'
    windowRef.current.style.transform = `perspective(300px) rotateX(${tilt}deg)`
  }

  function handleMouseLeave() {
    if (!windowRef.current) return
    windowRef.current.style.transition = 'transform 0.5s ease-out'
    windowRef.current.style.transform = 'perspective(300px) rotateX(0deg)'
  }

  const spin = useCallback((targetIdx, opts = {}) => {
    if (busyRef.current) return
    busyRef.current = true
    // Snap tilt back before spinning
    if (windowRef.current) {
      windowRef.current.style.transition = 'transform 0.25s ease-out'
      windowRef.current.style.transform = 'perspective(300px) rotateX(0deg)'
    }
    const prism = prismRef.current

    // Work out which face is currently showing
    const stepsTaken = Math.round(-angleRef.current / 120)
    const currentFace = ((stepsTaken % 3) + 3) % 3

    // Steps to reach target going forward (more negative angle)
    const stepsToTarget = (targetIdx - currentFace + 3) % 3
    const laps = opts.laps ?? (3 + Math.floor(Math.random() * 2)) // 3–4 full rotations
    const totalSteps = laps * 3 + stepsToTarget
    const newAngle = angleRef.current - totalSteps * 120
    const duration = opts.duration ?? (2600 + Math.random() * 1400)

    prism.style.transition = `transform ${duration}ms ease-in-out`
    prism.style.transform = `rotateX(${newAngle}deg)`
    angleRef.current = newAngle

    setTimeout(() => {
      busyRef.current = false
      onDone?.()
    }, duration + 50)
  }, [onDone])

  useImperativeHandle(ref, () => ({ spin }), [spin])

  return (
    <div ref={windowRef} className="segment-window" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="prism-scene">
        <div ref={prismRef} className="prism-container">
          {/* Face 0 at 0°, Face 1 at -120°, Face 2 at -240° */}
          <div className="prism-face" style={{ transform: 'rotateX(0deg) translateZ(var(--prism-r))' }}>
            <img src={images[0]} alt="" draggable="false" />
          </div>
          {/* At container -120°, the -240° face comes to the front; at -240°, the -120° face does.
              So images[1] and images[2] are placed on the opposite faces from their index. */}
          <div className="prism-face" style={{ transform: 'rotateX(-120deg) translateZ(var(--prism-r))' }}>
            <img src={images[2]} alt="" draggable="false" />
          </div>
          <div className="prism-face" style={{ transform: 'rotateX(-240deg) translateZ(var(--prism-r))' }}>
            <img src={images[1]} alt="" draggable="false" />
          </div>
        </div>
      </div>
    </div>
  )
})
