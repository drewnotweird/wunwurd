import { useEffect, useRef } from 'react'

// ── helpers ────────────────────────────────────────────────────────────────
function rgba(hex, a) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}
function lerp(a, b, t) { return a + (b - a) * t }

// ── Effect: tunnel vortex (track 0 — Down the Drain) ──────────────────────
function effectDrain(ctx, W, H, t, accent, state, amp) {
  ctx.fillStyle = `rgba(0,0,0,${0.08 + amp * 0.06})`
  ctx.fillRect(0, 0, W, H)
  const cx = W / 2, cy = H / 2
  const maxR = Math.min(W, H) * 0.52
  const speed = 0.00055 + amp * 0.0025

  // Radial tunnel lines
  const lineCount = 32
  for (let i = 0; i < lineCount; i++) {
    const angle = (i / lineCount) * Math.PI * 2 + t * 0.00015
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(angle) * maxR * 0.04, cy + Math.sin(angle) * maxR * 0.022)
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR * 0.58)
    ctx.strokeStyle = rgba(accent, 0.06 + amp * 0.1)
    ctx.lineWidth = 0.5
    ctx.stroke()
  }

  // Zooming elliptical rings
  const ringCount = 14
  for (let i = 0; i < ringCount; i++) {
    const phase = ((i / ringCount) + t * speed) % 1
    const r = phase * maxR
    const alpha = Math.sin(phase * Math.PI) * (0.55 + amp * 0.45)
    ctx.beginPath()
    ctx.ellipse(cx, cy, r, r * 0.58, 0, 0, Math.PI * 2)
    ctx.strokeStyle = rgba(accent, alpha)
    ctx.lineWidth = lerp(2.5, 0.3, phase) + amp * 3
    ctx.stroke()
  }

  // Spiral particles draining inward
  const count = 90
  for (let i = 0; i < count; i++) {
    const age = ((t * speed * 1.8 + i * 0.02) % 1)
    const r = (1 - age) * maxR * 0.92
    const spin = (i / count) * Math.PI * 2 + age * Math.PI * 12 + t * 0.0003
    const x = cx + Math.cos(spin) * r
    const y = cy + Math.sin(spin) * r * 0.58
    const size = (1 - age) * (2.5 + amp * 5)
    const alpha = Math.sin(age * Math.PI) * (0.7 + amp * 0.3)
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fillStyle = rgba(accent, alpha)
    ctx.fill()
  }

  // Central bright core
  const coreSize = 4 + amp * 18
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize)
  grad.addColorStop(0, rgba(accent, 0.9 + amp * 0.1))
  grad.addColorStop(1, rgba(accent, 0))
  ctx.beginPath()
  ctx.arc(cx, cy, coreSize, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()
}

// ── Effect: lava lamp (track 1 — A Week of Pain) ──────────────────────────
function effectLava(ctx, W, H, t, accent, state, amp) {
  if (!state.blobs) {
    state.blobs = Array.from({ length: 9 }, (_, i) => ({
      x: W * 0.15 + Math.random() * W * 0.7,
      y: H * 0.4 + (Math.random() - 0.5) * H * 0.9,
      r: W * 0.09 + Math.random() * W * 0.1,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.25,
      phase: Math.random() * Math.PI * 2,
    }))
    state.embers = []
  }

  ctx.fillStyle = `rgba(8,1,1,${0.28 + amp * 0.12})`
  ctx.fillRect(0, 0, W, H)

  // Embers rising from bottom
  if (Math.random() < 0.35 + amp * 0.6) {
    state.embers.push({
      x: W * 0.1 + Math.random() * W * 0.8,
      y: H + 4,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(0.6 + Math.random() * 1.4 + amp * 2),
      life: 1, size: Math.random() * 2.5 + 0.5,
    })
  }
  for (let i = state.embers.length - 1; i >= 0; i--) {
    const e = state.embers[i]
    e.x += e.vx; e.y += e.vy; e.vy *= 0.995
    e.life -= 0.008 + Math.random() * 0.006
    if (e.life <= 0 || e.y < -10) { state.embers.splice(i, 1); continue }
    ctx.beginPath()
    ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2)
    ctx.fillStyle = rgba(accent, e.life * 0.7)
    ctx.fill()
  }

  // Blobs with buoyancy
  for (const b of state.blobs) {
    const buoy = (H * 0.48 - b.y) * 0.00012
    b.vy += buoy * (1 + amp * 4) + Math.sin(t * 0.00025 + b.phase) * (0.012 + amp * 0.05)
    b.vx += (Math.random() - 0.5) * (0.03 + amp * 0.1)
    b.vx *= 0.97; b.vy *= 0.975
    b.vy = Math.max(-0.9, Math.min(0.9, b.vy))
    b.x += b.vx; b.y += b.vy
    if (b.x < b.r) { b.x = b.r; b.vx *= -0.6 }
    if (b.x > W - b.r) { b.x = W - b.r; b.vx *= -0.6 }
    if (b.y < -b.r * 0.6) { b.y = -b.r * 0.6; b.vy *= -0.5 }
    if (b.y > H + b.r * 0.6) { b.y = H + b.r * 0.6; b.vy *= -0.5 }

    const rr = b.r * (0.88 + Math.sin(t * 0.0009 + b.phase) * 0.14 + amp * 0.4)
    // Outer glow
    const glow = ctx.createRadialGradient(b.x, b.y, rr * 0.3, b.x, b.y, rr * 1.6)
    glow.addColorStop(0, rgba(accent, 0.18))
    glow.addColorStop(1, rgba(accent, 0))
    ctx.beginPath()
    ctx.arc(b.x, b.y, rr * 1.6, 0, Math.PI * 2)
    ctx.fillStyle = glow
    ctx.fill()
    // Core blob
    const grad = ctx.createRadialGradient(b.x - rr * 0.2, b.y - rr * 0.2, 0, b.x, b.y, rr)
    grad.addColorStop(0, rgba(accent, 0.98))
    grad.addColorStop(0.45, rgba(accent, 0.75))
    grad.addColorStop(1, rgba(accent, 0))
    ctx.beginPath()
    ctx.arc(b.x, b.y, rr, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()
  }

  // Heat glow at bottom
  const bottomGrad = ctx.createLinearGradient(0, H, 0, H * 0.55)
  bottomGrad.addColorStop(0, rgba(accent, 0.22 + amp * 0.2))
  bottomGrad.addColorStop(1, rgba(accent, 0))
  ctx.fillStyle = bottomGrad
  ctx.fillRect(0, 0, W, H)
}

// ── Effect: explosion burst (track 2 — Eugene Kelly) ──────────────────────
function effectFountain(ctx, W, H, t, accent, state, amp) {
  if (!state.particles) { state.particles = []; state.sparks = [] }
  ctx.fillStyle = `rgba(0,0,0,${0.14 + amp * 0.05})`
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2, cy = H * 0.62
  const burst = 3 + Math.floor(amp * 10)

  for (let b = 0; b < burst; b++) {
    const angle = Math.random() * Math.PI * 2
    const spd = 3 + Math.random() * 5 + amp * 8
    state.particles.push({
      x: cx + (Math.random() - 0.5) * W * 0.08,
      y: cy,
      px: cx, py: cy,
      vx: Math.cos(angle) * spd * (0.5 + Math.random() * 0.5),
      vy: -Math.abs(Math.sin(angle)) * spd - 2,
      life: 1, decay: 0.007 + Math.random() * 0.01,
      size: Math.random() * 3.5 + 1,
      bright: Math.random() > 0.6,
    })
  }

  // Maintain base particles
  while (state.particles.length < 120) {
    state.particles.push({
      x: cx + (Math.random() - 0.5) * W * 0.12,
      y: cy,
      px: cx, py: cy,
      vx: (Math.random() - 0.5) * 5,
      vy: -(Math.random() * 7 + 3),
      life: 1, decay: 0.009 + Math.random() * 0.01,
      size: Math.random() * 2.5 + 0.8,
      bright: false,
    })
  }

  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i]
    p.px = p.x; p.py = p.y
    p.x += p.vx; p.y += p.vy
    p.vy += 0.14; p.vx *= 0.99
    p.life -= p.decay
    if (p.life <= 0) { state.particles.splice(i, 1); continue }

    // Trail line
    ctx.beginPath()
    ctx.moveTo(p.px, p.py)
    ctx.lineTo(p.x, p.y)
    ctx.strokeStyle = rgba(accent, p.life * (p.bright ? 0.9 : 0.5))
    ctx.lineWidth = p.size * p.life * 0.7
    ctx.stroke()

    // Particle dot
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
    ctx.fillStyle = rgba(accent, p.life * (p.bright ? 1 : 0.7))
    ctx.fill()
  }

  // Central launch glow
  const launchGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 30 + amp * 60)
  launchGrad.addColorStop(0, rgba(accent, 0.4 + amp * 0.5))
  launchGrad.addColorStop(1, rgba(accent, 0))
  ctx.beginPath()
  ctx.arc(cx, cy, 30 + amp * 60, 0, Math.PI * 2)
  ctx.fillStyle = launchGrad
  ctx.fill()
}

// ── Effect: hyperspace warp (track 3 — Waiting To Fall) ──────────────────
function effectStarfield(ctx, W, H, t, accent, state, amp) {
  if (!state.stars) {
    state.stars = Array.from({ length: 140 }, () => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random(),
      speed: 0.0004 + Math.random() * 0.001,
      size: Math.random() * 1.8 + 0.3,
    }))
  }

  ctx.fillStyle = `rgba(0,0,0,${0.18 + amp * 0.1})`
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2, cy = H / 2
  const maxR = Math.sqrt(cx * cx + cy * cy) * 1.1
  const warpFactor = 1 + amp * 5

  for (const s of state.stars) {
    s.dist += s.speed * warpFactor
    if (s.dist > 1) { s.dist = 0.02; s.angle = Math.random() * Math.PI * 2 }

    const r = s.dist * maxR
    const x = cx + Math.cos(s.angle) * r
    const y = cy + Math.sin(s.angle) * r

    // Trail — how far back the streak goes
    const trailLen = s.speed * warpFactor * 80 * (0.5 + s.dist)
    const px = cx + Math.cos(s.angle) * Math.max(0, r - trailLen)
    const py = cy + Math.sin(s.angle) * Math.max(0, r - trailLen)

    const alpha = Math.min(1, s.dist * 2) * (0.5 + amp * 0.5)
    const bright = amp > 0.5 && s.size > 1.4

    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(x, y)
    ctx.strokeStyle = rgba(accent, bright ? Math.min(1, alpha * 1.8) : alpha)
    ctx.lineWidth = s.size * (0.5 + s.dist * 0.8) * (bright ? 2.5 : 1)
    ctx.stroke()

    // Bright head dot
    if (s.dist > 0.15) {
      ctx.beginPath()
      ctx.arc(x, y, s.size * (0.4 + s.dist * 0.8 + amp), 0, Math.PI * 2)
      ctx.fillStyle = rgba(accent, Math.min(1, alpha * 1.4))
      ctx.fill()
    }
  }

  // Central vanishing point glow
  const vp = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40 + amp * 30)
  vp.addColorStop(0, rgba(accent, 0.15 + amp * 0.3))
  vp.addColorStop(1, rgba(accent, 0))
  ctx.beginPath()
  ctx.arc(cx, cy, 40 + amp * 30, 0, Math.PI * 2)
  ctx.fillStyle = vp
  ctx.fill()
}

// ── Effect: northern lights (track 4 — Please Don't Ask) ─────────────────
function effectAurora(ctx, W, H, t, accent, state, amp) {
  ctx.fillStyle = `rgba(0,0,0,${0.07 + amp * 0.04})`
  ctx.fillRect(0, 0, W, H)

  const cols = 48
  const colW = W / cols

  for (let c = 0; c < cols; c++) {
    const cx = c * colW + colW / 2
    const phase = (c / cols) * Math.PI * 4

    // Each column is a vertical curtain strip — height varies via slow wave
    const heightFrac = 0.25
      + Math.sin(phase + t * 0.0005) * 0.15
      + Math.sin(phase * 0.7 - t * 0.0003) * 0.1
      + amp * 0.25

    const topY = H * (0.05 + Math.sin(phase * 0.5 + t * 0.0004) * 0.12 + amp * 0.08)
    const botY = topY + H * heightFrac

    // Lateral sway
    const sway = Math.sin(phase * 0.3 + t * 0.00035) * 12 + amp * 8

    const alpha = (0.04 + Math.sin(phase + t * 0.0007) * 0.025 + amp * 0.18) * (0.5 + heightFrac)

    const grad = ctx.createLinearGradient(cx + sway, topY, cx + sway, botY)
    grad.addColorStop(0, rgba(accent, 0))
    grad.addColorStop(0.2, rgba(accent, alpha * 1.2))
    grad.addColorStop(0.6, rgba(accent, alpha))
    grad.addColorStop(1, rgba(accent, 0))

    ctx.fillStyle = grad
    ctx.fillRect(cx - colW * 0.9 + sway, topY, colW * 1.8, botY - topY)
  }

  // Slower wide sweeping bands on top
  const bands = 3
  for (let b = 0; b < bands; b++) {
    const phase = (b / bands) * Math.PI * 2
    const baseY = H * (0.15 + (b / bands) * 0.5)
    ctx.beginPath()
    ctx.moveTo(0, baseY)
    for (let x = 0; x <= W; x += 4) {
      const y = baseY
        + Math.sin(x * 0.006 + t * 0.0004 + phase) * (25 + amp * 40)
        + Math.sin(x * 0.009 - t * 0.0003 + phase * 1.4) * 15
      ctx.lineTo(x, y)
    }
    ctx.strokeStyle = rgba(accent, 0.07 + amp * 0.12)
    ctx.lineWidth = 20 + Math.sin(t * 0.0006 + phase) * 8 + amp * 35
    ctx.stroke()
  }
}

// ── Effect: kaleidoscope (track 5 — Equilibrium) ─────────────────────────
function effectKaleidoscope(ctx, W, H, t, accent, state, amp) {
  ctx.fillStyle = `rgba(0,0,0,${0.06 + amp * 0.04})`
  ctx.fillRect(0, 0, W, H)

  const cx = W / 2, cy = H / 2
  const maxR = Math.min(W, H) * 0.47
  const speed = 0.00025 + amp * 0.0018

  const slices = 8
  const layers = 5

  for (let s = 0; s < slices; s++) {
    const sliceAngle = (s / slices) * Math.PI * 2

    for (let l = 0; l < layers; l++) {
      const r = maxR * (0.18 + 0.17 * l) * (1 + amp * 0.25)
      const a1 = sliceAngle + t * speed * (1 + l * 0.3)
      const a2 = sliceAngle + t * speed * (1 + l * 0.3) * -0.7 + l * 0.8

      const x1 = cx + Math.cos(a1) * r
      const y1 = cy + Math.sin(a1) * r
      const x2 = cx + Math.cos(a2) * r * 0.6
      const y2 = cy + Math.sin(a2) * r * 0.6

      // Mirror point
      const mx1 = cx - (x1 - cx), my1 = cy - (y1 - cy)
      const mx2 = cx - (x2 - cx), my2 = cy - (y2 - cy)

      const hue = (t * 0.04 + s * 45 + l * 22) % 360
      const alpha = 0.4 + amp * 0.5

      // Connecting lines within layer
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.lineTo(mx1, my1)
      ctx.lineTo(mx2, my2)
      ctx.closePath()
      ctx.strokeStyle = `hsla(${hue},70%,70%,${alpha * 0.5})`
      ctx.lineWidth = 0.8 + amp * 1.5
      ctx.stroke()
      ctx.fillStyle = `hsla(${hue},70%,60%,${0.06 + amp * 0.1})`
      ctx.fill()

      // Dots at nodes
      for (const [dx, dy] of [[x1, y1], [x2, y2], [mx1, my1], [mx2, my2]]) {
        ctx.beginPath()
        ctx.arc(dx, dy, 2 + l * 1.2 + amp * 5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue},80%,75%,${0.6 + amp * 0.4})`
        ctx.fill()
      }

      // Cross-connecting lines between adjacent slices
      const nextAngle = ((s + 1) / slices) * Math.PI * 2 + t * speed * (1 + l * 0.3)
      const nx = cx + Math.cos(nextAngle) * r
      const ny = cy + Math.sin(nextAngle) * r
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(nx, ny)
      ctx.strokeStyle = `hsla(${(hue + 60) % 360},60%,65%,${0.15 + amp * 0.2})`
      ctx.lineWidth = 0.5
      ctx.stroke()
    }
  }

  // Pulsing central ring
  const rings = 3
  for (let r = 0; r < rings; r++) {
    const rr = maxR * (0.08 + r * 0.06) + Math.sin(t * 0.002 + r) * 4 + amp * (12 + r * 8)
    ctx.beginPath()
    ctx.arc(cx, cy, rr, 0, Math.PI * 2)
    ctx.strokeStyle = `hsla(${(t * 0.06 + r * 40) % 360},80%,80%,${0.35 + amp * 0.55})`
    ctx.lineWidth = 1.5 + amp * (2 + r)
    ctx.stroke()
  }

  // Bright centre
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 15 + amp * 20)
  core.addColorStop(0, `hsla(${(t * 0.08) % 360},80%,90%,${0.6 + amp * 0.4})`)
  core.addColorStop(1, `hsla(${(t * 0.08) % 360},80%,70%,0)`)
  ctx.beginPath()
  ctx.arc(cx, cy, 15 + amp * 20, 0, Math.PI * 2)
  ctx.fillStyle = core
  ctx.fill()
}

const EFFECTS = [effectDrain, effectLava, effectFountain, effectStarfield, effectAurora, effectKaleidoscope]

export default function CosmicBackground({ trackId, accentColor, isActive, getAudioData }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const isActiveRef = useRef(isActive)
  const getAudioDataRef = useRef(getAudioData)
  const stateRef = useRef({})
  const lastTsRef = useRef(null)
  const runningTimeRef = useRef(0)

  useEffect(() => { isActiveRef.current = isActive }, [isActive])
  useEffect(() => { getAudioDataRef.current = getAudioData }, [getAudioData])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const fn = EFFECTS[trackId]

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      stateRef.current = {}
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const loop = (ts) => {
      rafRef.current = requestAnimationFrame(loop)
      if (isActiveRef.current) {
        const delta = lastTsRef.current ? ts - lastTsRef.current : 0
        runningTimeRef.current += delta
        const audioData = getAudioDataRef.current?.() ?? null
        let amp = 0
        if (audioData) {
          let sum = 0
          for (let i = 0; i < 16; i++) sum += audioData[i]
          amp = Math.min(1, (sum / 16) / 180)
        }
        fn(ctx, canvas.width, canvas.height, runningTimeRef.current, accentColor, stateRef.current, amp)
      }
      lastTsRef.current = ts
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [trackId, accentColor])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  )
}
