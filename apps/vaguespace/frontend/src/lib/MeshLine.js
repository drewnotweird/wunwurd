import * as THREE from 'three'
import { extend } from '@react-three/fiber'

// ── MeshLine geometry ─────────────────────────────────────────────────────
// Ported from https://github.com/winkerVSbecks/solarstorm

function memcpy(src, srcOffset, dst, dstOffset, length) {
  let i = length
  while (i--) dst[dstOffset++] = src[srcOffset++]
}

export class MeshLine extends THREE.BufferGeometry {
  constructor() {
    super()
    this.type = 'MeshLine'
    this.isMeshLine = true
    this.positions = []
    this.previous = []
    this.next = []
    this.side = []
    this.width = []
    this.indices_array = []
    this.uvs = []
    this.counters = []
    this._points = []
    this._geom = null
    this.widthCallback = null
    this.matrixWorld = new THREE.Matrix4()

    Object.defineProperties(this, {
      geometry: { enumerable: true, get() { return this } },
      points: {
        enumerable: true,
        get() { return this._points },
        set(value) { this.setPoints(value, this.widthCallback) },
      },
    })
  }

  setPoints(points, wcb) {
    this._points = points
    this.widthCallback = wcb
    this.positions = []
    this.counters = []
    if (points.length && points[0] instanceof THREE.Vector3) {
      for (let j = 0; j < points.length; j++) {
        const p = points[j]
        const c = j / points.length
        this.positions.push(p.x, p.y, p.z, p.x, p.y, p.z)
        this.counters.push(c, c)
      }
    } else {
      for (let j = 0; j < points.length; j += 3) {
        const c = j / points.length
        this.positions.push(points[j], points[j + 1], points[j + 2], points[j], points[j + 1], points[j + 2])
        this.counters.push(c, c)
      }
    }
    this.process()
  }

  compareV3(a, b) {
    const aa = a * 6, ab = b * 6
    return this.positions[aa] === this.positions[ab] &&
           this.positions[aa + 1] === this.positions[ab + 1] &&
           this.positions[aa + 2] === this.positions[ab + 2]
  }

  copyV3(a) {
    const aa = a * 6
    return [this.positions[aa], this.positions[aa + 1], this.positions[aa + 2]]
  }

  process() {
    const l = this.positions.length / 6
    this.previous = []; this.next = []; this.side = []
    this.width = []; this.indices_array = []; this.uvs = []

    let v = this.compareV3(0, l - 1) ? this.copyV3(l - 2) : this.copyV3(0)
    this.previous.push(v[0], v[1], v[2], v[0], v[1], v[2])

    for (let j = 0; j < l; j++) {
      this.side.push(1, -1)
      const w = this.widthCallback ? this.widthCallback(j / (l - 1)) : 1
      this.width.push(w, w)
      this.uvs.push(j / (l - 1), 0, j / (l - 1), 1)

      if (j < l - 1) {
        v = this.copyV3(j)
        this.previous.push(v[0], v[1], v[2], v[0], v[1], v[2])
        const n = j * 2
        this.indices_array.push(n, n + 1, n + 2, n + 2, n + 1, n + 3)
      }
      if (j > 0) {
        v = this.copyV3(j)
        this.next.push(v[0], v[1], v[2], v[0], v[1], v[2])
      }
    }

    v = this.compareV3(l - 1, 0) ? this.copyV3(1) : this.copyV3(l - 1)
    this.next.push(v[0], v[1], v[2], v[0], v[1], v[2])

    if (!this._attributes || this._attributes.position.count !== this.positions.length) {
      this._attributes = {
        position: new THREE.BufferAttribute(new Float32Array(this.positions), 3),
        previous: new THREE.BufferAttribute(new Float32Array(this.previous), 3),
        next:     new THREE.BufferAttribute(new Float32Array(this.next), 3),
        side:     new THREE.BufferAttribute(new Float32Array(this.side), 1),
        width:    new THREE.BufferAttribute(new Float32Array(this.width), 1),
        uv:       new THREE.BufferAttribute(new Float32Array(this.uvs), 2),
        index:    new THREE.BufferAttribute(new Uint16Array(this.indices_array), 1),
        counters: new THREE.BufferAttribute(new Float32Array(this.counters), 1),
      }
    } else {
      for (const [k, arr] of [
        ['position', this.positions], ['previous', this.previous], ['next', this.next],
        ['side', this.side], ['width', this.width], ['uv', this.uvs], ['counters', this.counters],
      ]) {
        this._attributes[k].copyArray(new Float32Array(arr))
        this._attributes[k].needsUpdate = true
      }
      this._attributes.index.copyArray(new Uint16Array(this.indices_array))
      this._attributes.index.needsUpdate = true
    }

    this.setAttribute('position', this._attributes.position)
    this.setAttribute('previous', this._attributes.previous)
    this.setAttribute('next', this._attributes.next)
    this.setAttribute('side', this._attributes.side)
    this.setAttribute('width', this._attributes.width)
    this.setAttribute('uv', this._attributes.uv)
    this.setAttribute('counters', this._attributes.counters)
    this.setIndex(this._attributes.index)
    this.computeBoundingSphere()
    this.computeBoundingBox()
  }
}

// ── MeshLine material ─────────────────────────────────────────────────────

THREE.ShaderChunk['meshline_vert'] = [
  '#include <common>',
  THREE.ShaderChunk.logdepthbuf_pars_vertex,
  THREE.ShaderChunk.fog_pars_vertex,
  'attribute vec3 previous;',
  'attribute vec3 next;',
  'attribute float side;',
  'attribute float width;',
  'attribute float counters;',
  'uniform vec2 resolution;',
  'uniform float lineWidth;',
  'uniform vec3 color;',
  'uniform float opacity;',
  'uniform float sizeAttenuation;',
  'varying vec2 vUV;',
  'varying vec4 vColor;',
  'varying float vCounters;',
  'vec2 fix(vec4 i, float aspect){',
  '  vec2 res=i.xy/i.w; res.x*=aspect; vCounters=counters; return res;',
  '}',
  'void main(){',
  '  float aspect=resolution.x/resolution.y;',
  '  vColor=vec4(color,opacity); vUV=uv;',
  '  mat4 m=projectionMatrix*modelViewMatrix;',
  '  vec4 finalPosition=m*vec4(position,1.);',
  '  vec4 prevPos=m*vec4(previous,1.);',
  '  vec4 nextPos=m*vec4(next,1.);',
  '  vec2 currentP=fix(finalPosition,aspect);',
  '  vec2 prevP=fix(prevPos,aspect);',
  '  vec2 nextP=fix(nextPos,aspect);',
  '  float w=lineWidth*width;',
  '  vec2 dir;',
  '  if(nextP==currentP) dir=normalize(currentP-prevP);',
  '  else if(prevP==currentP) dir=normalize(nextP-currentP);',
  '  else{',
  '    vec2 dir1=normalize(currentP-prevP);',
  '    vec2 dir2=normalize(nextP-currentP);',
  '    dir=normalize(dir1+dir2);',
  '  }',
  '  vec4 normal=vec4(-dir.y,dir.x,0.,1.);',
  '  normal.xy*=.5*w;',
  '  normal*=projectionMatrix;',
  '  if(sizeAttenuation==0.){normal.xy*=finalPosition.w; normal.xy/=(vec4(resolution,0.,1.)*projectionMatrix).xy;}',
  '  finalPosition.xy+=normal.xy*side;',
  '  gl_Position=finalPosition;',
  THREE.ShaderChunk.logdepthbuf_vertex,
  '  vec4 mvPosition=modelViewMatrix*vec4(position,1.);',
  THREE.ShaderChunk.fog_vertex,
  '}',
].join('\n')

THREE.ShaderChunk['meshline_frag'] = [
  THREE.ShaderChunk.fog_pars_fragment,
  THREE.ShaderChunk.logdepthbuf_pars_fragment,
  'uniform sampler2D map;',
  'uniform sampler2D alphaMap;',
  'uniform float useMap;',
  'uniform float useAlphaMap;',
  'uniform float useDash;',
  'uniform float dashArray;',
  'uniform float dashOffset;',
  'uniform float dashRatio;',
  'uniform float visibility;',
  'uniform float alphaTest;',
  'uniform vec2 repeat;',
  'varying vec2 vUV;',
  'varying vec4 vColor;',
  'varying float vCounters;',
  'void main(){',
  THREE.ShaderChunk.logdepthbuf_fragment,
  '  vec4 c=vColor;',
  '  if(useMap==1.) c*=texture2D(map,vUV*repeat);',
  '  if(useAlphaMap==1.) c.a*=texture2D(alphaMap,vUV*repeat).a;',
  '  if(c.a<alphaTest) discard;',
  '  if(useDash==1.) c.a*=ceil(mod(vCounters+dashOffset,dashArray)-(dashArray*dashRatio));',
  '  gl_FragColor=c;',
  '  gl_FragColor.a*=step(vCounters,visibility);',
  THREE.ShaderChunk.fog_fragment,
  '}',
].join('\n')

export class MeshLineMaterial extends THREE.ShaderMaterial {
  constructor(parameters) {
    super({
      uniforms: Object.assign({}, THREE.UniformsLib.fog, {
        lineWidth:      { value: 1 },
        map:            { value: null },
        useMap:         { value: 0 },
        alphaMap:       { value: null },
        useAlphaMap:    { value: 0 },
        color:          { value: new THREE.Color(0xffffff) },
        opacity:        { value: 1 },
        resolution:     { value: new THREE.Vector2(1, 1) },
        sizeAttenuation:{ value: 1 },
        dashArray:      { value: 0 },
        dashOffset:     { value: 0 },
        dashRatio:      { value: 0.5 },
        useDash:        { value: 0 },
        visibility:     { value: 1 },
        alphaTest:      { value: 0 },
        repeat:         { value: new THREE.Vector2(1, 1) },
      }),
      vertexShader:   THREE.ShaderChunk.meshline_vert,
      fragmentShader: THREE.ShaderChunk.meshline_frag,
    })
    this.type = 'MeshLineMaterial'

    const props = ['lineWidth','color','opacity','resolution','sizeAttenuation',
                   'dashArray','dashOffset','dashRatio','useDash','visibility','alphaTest']
    for (const p of props) {
      Object.defineProperty(this, p, {
        enumerable: true,
        get() { return this.uniforms[p].value },
        set(v) {
          this.uniforms[p].value = v
          if (p === 'dashArray') this.uniforms.useDash.value = v !== 0 ? 1 : 0
        },
      })
    }
    this.setValues(parameters)
  }
}

extend({ MeshLine, MeshLineMaterial })
