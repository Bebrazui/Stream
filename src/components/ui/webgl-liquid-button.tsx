
'use client';

import React, { useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

// Vertex Shader: Renders a 2D plane
const vsSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Fragment Shader from your code
const fsSource = `
  precision mediump float;

  uniform vec3 iResolution;
  uniform float iTime;
  uniform vec4 iMouse;
  uniform sampler2D iChannel0;

  void mainImage(out vec4 fragColor, in vec2 fragCoord)
  {
    const float NUM_ZERO = 0.0;
    const float NUM_ONE = 1.0;
    const float NUM_HALF = 0.5;
    const float NUM_TWO = 2.0;
    const float POWER_EXPONENT = 6.0;
    const float MASK_MULTIPLIER_1 = 10000.0;
    const float MASK_MULTIPLIER_2 = 9500.0;
    const float MASK_MULTIPLIER_3 = 11000.0;
    const float LENS_MULTIPLIER = 5000.0;
    const float MASK_STRENGTH_1 = 8.0;
    const float MASK_STRENGTH_2 = 16.0;
    const float MASK_STRENGTH_3 = 2.0;
    const float MASK_THRESHOLD_1 = 0.95;
    const float MASK_THRESHOLD_2 = 0.9;
    const float MASK_THRESHOLD_3 = 1.5;
    const float SAMPLE_RANGE = 4.0;
    const float SAMPLE_OFFSET = 0.5;
    const float GRADIENT_RANGE = 0.2;
    const float GRADIENT_OFFSET = 0.1;
    const float GRADIENT_EXTREME = -1000.0;
    const float LIGHTING_INTENSITY = 0.3;

    vec2 uv = fragCoord / iResolution.xy;
    vec2 mouse = iMouse.xy;
    if (length(mouse) < NUM_ONE) {
      mouse = iResolution.xy / NUM_TWO;
    }
    vec2 m2 = (uv - mouse / iResolution.xy);

    float roundedBox = pow(abs(m2.x * iResolution.x / iResolution.y), POWER_EXPONENT) + pow(abs(m2.y), POWER_EXPONENT);
    float rb1 = clamp((NUM_ONE - roundedBox * MASK_MULTIPLIER_1) * MASK_STRENGTH_1, NUM_ZERO, NUM_ONE);
    float rb2 = clamp((MASK_THRESHOLD_1 - roundedBox * MASK_MULTIPLIER_2) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE) -
      clamp(pow(MASK_THRESHOLD_2 - roundedBox * MASK_MULTIPLIER_2, NUM_ONE) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE);
    float rb3 = clamp((MASK_THRESHOLD_3 - roundedBox * MASK_MULTIPLIER_3) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE) -
      clamp(pow(NUM_ONE - roundedBox * MASK_MULTIPLIER_3, NUM_ONE) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE);

    fragColor = vec4(NUM_ZERO);
    float transition = smoothstep(NUM_ZERO, NUM_ONE, rb1 + rb2);

    if (transition > NUM_ZERO) {
      vec2 lens = ((uv - NUM_HALF) * NUM_ONE * (NUM_ONE - roundedBox * LENS_MULTIPLIER) + NUM_HALF);
      float total = NUM_ZERO;
      for (float x = -SAMPLE_RANGE; x <= SAMPLE_RANGE; x++) {
        for (float y = -SAMPLE_RANGE; y <= SAMPLE_RANGE; y++) {
          vec2 offset = vec2(x, y) * SAMPLE_OFFSET / iResolution.xy;
          fragColor += texture2D(iChannel0, offset + lens);
          total += NUM_ONE;
        }
      }
      fragColor /= total;

      float gradient = clamp((clamp(m2.y, NUM_ZERO, GRADIENT_RANGE) + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE) +
        clamp((clamp(-m2.y, GRADIENT_EXTREME, GRADIENT_RANGE) * rb3 + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE);
      vec4 lighting = clamp(fragColor + vec4(rb1) * gradient + vec4(rb2) * LIGHTING_INTENSITY, NUM_ZERO, NUM_ONE);

      fragColor = mix(texture2D(iChannel0, uv), lighting, transition);
    } else {
      // Instead of black, let's make the base slightly visible and glassy
      vec4 baseColor = vec4(0.1, 0.1, 0.15, 0.7);
      fragColor = mix(texture2D(iChannel0, uv), baseColor, 0.5);
    }
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
`;

interface WebGLLiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const WebGLLiquidButton: React.FC<WebGLLiquidButtonProps> = ({ className, children, ...props }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<any>({});
  const mouseRef = useRef<[number, number]>([0, 0]);
  const animationFrameId = useRef<number>();
  const startTimeRef = useRef(Date.now());

  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true }); // Enable alpha
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }
    glRef.current = gl;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    programRef.current = program;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      resolution: gl.getUniformLocation(program, "iResolution"),
      time: gl.getUniformLocation(program, "iTime"),
      mouse: gl.getUniformLocation(program, "iMouse"),
      texture: gl.getUniformLocation(program, "iChannel0"),
    };
    
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    gl.clearColor(0, 0, 0, 0);

    startTimeRef.current = Date.now();
    render();

  }, []);

  const render = useCallback(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas || !programRef.current) return;

    const currentTime = (Date.now() - startTimeRef.current) / 1000;
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programRef.current);
    gl.uniform3f(uniformsRef.current.resolution, canvas.width, canvas.height, 1.0);
    gl.uniform1f(uniformsRef.current.time, currentTime);
    gl.uniform4f(uniformsRef.current.mouse, mouseRef.current[0], mouseRef.current[1], 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(uniformsRef.current.texture, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animationFrameId.current = requestAnimationFrame(render);
  }, []);
  
  useLayoutEffect(() => {
     const canvas = canvasRef.current;
     const resize = () => {
        if(canvas && canvas.parentElement) {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
     }
     window.addEventListener('resize', resize);
     resize();
     return () => window.removeEventListener('resize', resize);
  }, [])

  useEffect(() => {
    initWebGL();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      const gl = glRef.current;
      if (gl) {
         gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, [initWebGL]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = [e.clientX - rect.left, rect.height - (e.clientY - rect.top)];
  };

  return (
    <button
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden text-white rounded-lg", 
        "flex items-center justify-center", // Center content
        className
        )}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};

export { WebGLLiquidButton };
