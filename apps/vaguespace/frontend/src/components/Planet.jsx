import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Inlined GLSL noise functions ──────────────────────────────────────────
const NOISE_GLSL = `
// 4D Simplex Noise
float mod289f(float x){return x-floor(x*(1./289.))*289.;}
vec4  mod289v(vec4  x){return x-floor(x*(1./289.))*289.;}
vec4  permute4(vec4 x){return mod289v(((x*34.)+1.)*x);}
float permuteF(float x){return mod289f(((x*34.)+1.)*x);}
vec4  tiSqrtV(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float tiSqrtF(float r){return 1.79284291400159-0.85373472095314*r;}
vec4 grad4(float j,vec4 ip){
  const vec4 ones=vec4(1.,1.,1.,-1.);
  vec4 p,s;
  p.xyz=floor(fract(vec3(j)*ip.xyz)*7.)*ip.z-1.;
  p.w=1.5-dot(abs(p.xyz),ones.xyz);
  s=vec4(lessThan(p,vec4(0.)));
  p.xyz=p.xyz+(s.xyz*2.-1.)*s.www;
  return p;
}
#define F4 0.309016994374947451
float noise(vec4 v){
  const vec4 C=vec4(0.138196601125011,0.276393202250021,0.414589803375032,-0.447213595499958);
  vec4 i=floor(v+dot(v,vec4(F4)));
  vec4 x0=v-i+dot(i,C.xxxx);
  vec4 i1,i2,i3;
  bvec4 isX=greaterThan(x0.yzwx,x0.xyzw);
  bvec4 isY=greaterThan(x0.zwxy,x0.xyzw);
  bvec4 isZ=greaterThan(x0.wxyz,x0.xyzw);
  i3=vec4(isX.x?1.:0.,isX.y?1.:0.,isX.z?1.:0.,isX.w?1.:0.)
    +vec4(isY.x?1.:0.,isY.y?1.:0.,isY.z?1.:0.,isY.w?1.:0.)
    +vec4(isZ.x?1.:0.,isZ.y?1.:0.,isZ.z?1.:0.,isZ.w?1.:0.);
  i2=clamp(i3-1.,0.,1.); i1=clamp(i3-2.,0.,1.);
  vec4 x1=x0-i1+C.xxxx; vec4 x2=x0-i2+C.yyyy;
  vec4 x3=x0-vec4(.5)+C.zzzz; vec4 x4=x0+C.wwww;
  i=mod289v(i);
  float j0=permute4(permute4(permute4(permute4(i.w)+i.z)+i.y)+i.x);
  vec4 j1=permute4(permute4(permute4(permute4(
    i.w+vec4(i1.w,i2.w,i3.w,1.))+i.z+vec4(i1.z,i2.z,i3.z,1.))
    +i.y+vec4(i1.y,i2.y,i3.y,1.))+i.x+vec4(i1.x,i2.x,i3.x,1.));
  vec4 ip=vec4(1./294.,1./49.,1./7.,0.);
  vec4 p0=grad4(j0,ip),p1=grad4(j1.x,ip),p2=grad4(j1.y,ip),p3=grad4(j1.z,ip),p4=grad4(j1.w,ip);
  vec4 norm=tiSqrtV(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  p4*=tiSqrtF(dot(p4,p4));
  vec3 m0=max(.6-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),0.);
  vec2 m1=max(.6-vec2(dot(x3,x3),dot(x4,x4)),0.);
  m0=m0*m0; m1=m1*m1;
  return 49.*(dot(m0*m0,vec3(dot(p0,x0),dot(p1,x1),dot(p2,x2)))+dot(m1*m1,vec2(dot(p3,x3),dot(p4,x4))));
}
// 3D Simplex Noise
vec3  s3m(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4  s3m4(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4  s3p(vec4 x){return s3m4(((x*34.)+1.)*x);}
vec4  s3ti(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise3(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz),l=1.-g;
  vec3 i1=min(g.xyz,l.zxy),i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx,x2=x0-i2+C.yyy,x3=x0-D.yyy;
  i=s3m(i);
  vec4 p=s3p(s3p(s3p(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  vec3 ns=.142857142857*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z),y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy,y=y_*ns.x+ns.yyyy,h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy),b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.,s1=floor(b1)*2.+1.,sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy,a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x),p1=vec3(a0.zw,h.y),p2=vec3(a1.xy,h.z),p3=vec3(a1.zw,h.w);
  vec4 norm=s3ti(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
// loopNoise helper
float loopNoise(vec3 v,float t,float scale,float offset){
  float duration=scale,current=t*scale;
  return((duration-current)*noise(vec4(v,current+offset))+current*noise(vec4(v,current-duration+offset)))/duration;
}
const int AMOUNT=4;
`

const vertexShader = NOISE_GLSL + `
precision highp float;
varying vec2 vUv;
varying vec3 vPosition;
varying float vOutput;
uniform float u_music;
uniform float u_time;
uniform float u_scale;
uniform vec3  u_background;
uniform float u_distort;
uniform float u_radius;

void main(){
  vPosition=position;
  vec2 coord=20.*uv;
  vec3 p=position;
  float v=loopNoise(p,u_music,1.,60.)*0.5;
  float len;
  for(int i=0;i<AMOUNT;i++){
    len=length(coord);
    coord.x=coord.x-cos(coord.y+sin(len))+cos(u_music/9.);
    coord.y=coord.y+sin(coord.x+cos(len))+sin(u_music/12.);
  }
  len+=v*u_scale;
  vec3 disp=vec3(1.+cos(len));
  vOutput=len;
  vec3 newPos=position+normal*disp*0.1;
  float t=u_time/50.;
  float n=snoise3(newPos/2.+t*5.);
  vec3 transformed=newPos*(n*pow(u_distort,2.)+u_radius);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(transformed,1.);
  vUv=position.xy*0.5+0.5;
}
`

const fragmentShader = NOISE_GLSL + `
precision highp float;
uniform vec2  u_resolution;
uniform float u_music;
uniform float u_scale;
uniform vec3  u_background;
uniform vec3  u_foreground;
varying vec3  vPosition;
varying vec2  vUv;
varying float vOutput;

void main(){
  vec2 coord=20.*vUv;
  vec3 p=vPosition;
  float v=loopNoise(p,u_music,1.,60.)*0.5;
  float len;
  for(int i=0;i<AMOUNT;i++){
    len=length(coord);
    coord.x=coord.x-cos(coord.y+sin(len))+cos(u_music/9.);
    coord.y=coord.y+sin(coord.x+cos(len))+sin(u_music/12.);
  }
  len+=v*u_scale;
  vec3 color=mix(u_background,vec3(.25,.25,.25),cos(vOutput));
  gl_FragColor=vec4(color,1.);
}
`

export function Planet({ getAudioDataRef, planetBg, planetFg }) {
  const matRef = useRef()
  const meshRef = useRef()
  const musicTime = useRef(0)

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      u_time:       { value: 0 },
      u_music:      { value: 0 },
      u_resolution: { value: [800, 800] },
      u_scale:      { value: 1 },
      u_background: { value: new THREE.Color(planetBg) },
      u_foreground: { value: new THREE.Color(planetFg) },
      u_distort:    { value: 0.4 },
      u_radius:     { value: 1.0 },
    },
    vertexShader,
    fragmentShader,
  }), [planetBg, planetFg])

  useFrame((state) => {
    const data = getAudioDataRef.current?.()
    let melody = 0, bass = 0
    if (data) {
      let b = 0; for (let i = 0; i < 8; i++) b += data[i]
      bass = Math.min(1, b / 8 / 200)
      let m = 0; for (let i = 8; i < 48; i++) m += data[i]
      melody = Math.min(1, m / 40 / 180)
    }

    const active = getAudioDataRef.current !== null && data !== null
    if (active) musicTime.current += state.clock.getDelta() * 0.15

    material.uniforms.u_time.value = state.clock.elapsedTime
    material.uniforms.u_music.value = musicTime.current + bass * 0.3
    material.uniforms.u_distort.value = THREE.MathUtils.lerp(
      material.uniforms.u_distort.value,
      0.4 + melody * 0.5,
      0.05
    )

    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002 + bass * 0.015
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.05
    }
  })

  return (
    <group scale={[10, 10, 10]}>
      <mesh ref={meshRef} material={material}>
        <icosahedronGeometry args={[1, 60]} />
      </mesh>
    </group>
  )
}
