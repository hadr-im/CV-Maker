'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  // Carry the vertical falloff in alpha and leave the colour at full strength.
  // Scaling the colour by intensity instead (the original) emitted a near-black
  // pixel while alpha was still around 0.5 at the tail of the band: it took half
  // the background away and gave almost no colour back, which is invisible on a
  // near-black surface and a grey smear on a light one.
  // The colour term is arithmetically unchanged — still ramp * intensity * alpha
  // — so all that differs is how much background is left showing through.
  auroraAlpha *= clamp(intensity, 0.0, 1.0);

  fragColor = vec4(rampColor * auroraAlpha, auroraAlpha);
}
`;

interface AuroraProps {
  colorStops?: string[];
  amplitude?: number;
  blend?: number;
  time?: number;
  speed?: number;
}

export default function Aurora(props: AuroraProps) {
  const { colorStops = ['#5227FF', '#7cff67', '#5227FF'], amplitude = 1.0, blend = 0.5 } = props;
  const propsRef = useRef<AuroraProps>(props);
  propsRef.current = props;

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      // Default is 1, which renders the gradient at CSS-pixel size and lets the
      // browser upscale it — that is what makes the band look stepped on phones.
      // Capped at 2 so a 3x screen does not pay for fragments it cannot show.
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = 'transparent';

    let program: Program | undefined;

    // The canvas has to track the container's box, not the window's. The band's
    // height changes at breakpoints and its width changes whenever a scrollbar
    // appears or the layout reflows — none of which fires a window resize, which
    // would leave the canvas stamped at a stale pixel width and show background
    // down one edge.
    function resize() {
      if (!ctn) return;
      const width = ctn.clientWidth;
      const height = ctn.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      // setSize writes fixed pixel values onto the canvas. Stretch it back to
      // the container so even a measurement this has not caught yet still covers
      // the full box — only the internal resolution lags, invisibly on a
      // gradient this soft. display:block also drops the inline descender gap.
      gl.canvas.style.display = 'block';
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(ctn);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map(hex => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    const drawFrame = (t: number) => {
      if (!program) return;
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      program.uniforms.uTime.value = time * speed * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
      program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
      const stops = propsRef.current.colorStops ?? colorStops;
      program.uniforms.uColorStops.value = stops.map((hex: string) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh });
    };

    let animateId = 0;
    let running = false;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      drawFrame(t);
    };

    // The shader is cheap per frame but there is no reason to pay for it while
    // the hero is scrolled away, in a background tab, or when the visitor has
    // asked for less motion — in that last case we draw one frame and hold it.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      animateId = requestAnimationFrame(update);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(animateId);
    };

    let inView = false;
    const sync = () => (inView && !document.hidden ? start() : stop());

    const onScreen = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { rootMargin: '64px' },
    );
    onScreen.observe(ctn);

    document.addEventListener('visibilitychange', sync);

    resize();
    drawFrame(0);

    return () => {
      stop();
      onScreen.disconnect();
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
    // Deliberately empty: every prop is read off propsRef inside the frame loop,
    // so the GL context is built once and survives prop changes. Keying this on
    // amplitude tore down and rebuilt the context on a breakpoint or theme flip.
  }, []);

  return <div ref={ctnDom} className="w-full h-full" />;
}
