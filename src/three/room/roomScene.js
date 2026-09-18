import * as THREE from "three";

// The room. Real three.js geometry — boxes, lathes, extrusions and tubes —
// lit twice: an afternoon key coming through the window, and a night set where
// the lamps do all the work. Built in passes against refs/room-day.png and
// refs/room-night.png; nothing here is a billboard except the sky outside.
//
// Ported into the Next app: three comes from the project's own dependency
// rather than a CDN script, and the renderer, camera, controls and grain are
// owned by react-three-fiber / drei / the site's existing GrainOverlay.

// ---- room box, in metres ---------------------------------------------------
const R = {
  x0: -5.4, x1: 5.4,      // left / right walls — a room, not a corner
  z0: -5.0, z1: 3.6,      // back wall / behind camera
  y1: 2.85,               // ceiling: lower, so wall does not dominate floor
};

// the two palettes, read off the references
const PAL = {
  day: {
    wall: 0xd8c6a4, wallShade: 0xbfaa83, floor: 0xc9843c, ceiling: 0xd6c6a6,
    sky: [0x6ea8d8, 0xa8c9e0], orb: 0xfff2c4, city: 0x8fa6c4, tree: 0x6f8f4a,
    amb: 0.21, keyInt: 0.86, key: 0xffdca2, lamps: 0.0,
  },
  night: {
    wall: 0x6b5a48, wallShade: 0x594a3b, floor: 0x8a5f38, ceiling: 0x53463a,
    sky: [0x16233f, 0x2b3c5c], orb: 0xfdf3cd, city: 0x2a3550, tree: 0x1e2c26,
    amb: 0.20, keyInt: 0.16, key: 0xaebcd8, lamps: 1.0,
  },
};



// ---------------------------------------------------------------------------
// Open Peeps look: flat banded colour and a black outline. Two pieces —
//   1. MeshToonMaterial against a hard 3-step ramp, so light lands in bands
//      rather than a smooth falloff;
//   2. an inverted-hull outline, built by pushing a copy of the geometry along
//      its own vertex normals and drawing the back faces in ink.
// Offsetting along normals (rather than scaling the mesh) is what keeps the
// outline an even width on objects whose origin is not at their centre.
// ---------------------------------------------------------------------------
let RAMP = null;
function toonRamp(THREE) {
  if (RAMP) return RAMP;
  const steps = [64, 122, 186, 250];
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => {
    data[i * 4] = v; data[i * 4 + 1] = v; data[i * 4 + 2] = v; data[i * 4 + 3] = 255;
  });
  const t = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  RAMP = t;
  return t;
}

const INK = 0x191512;

// ---------------------------------------------------------------------------
// Surfaces, drawn in canvas at load. No downloads, no credits — and because
// they are drawn rather than photographed they stay inside the flat palette
// instead of dragging photoreal detail into an illustrated room.
// ---------------------------------------------------------------------------
const TEX_CACHE = {};
function canvasTex(THREE, key, size, draw, rx, ry) {
  if (TEX_CACHE[key]) return TEX_CACHE[key];
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx || 1, ry || 1);
  t.anisotropy = 4;
  TEX_CACHE[key] = t;
  return t;
}

function woodTex(THREE, rx, ry) {
  return canvasTex(THREE, 'wood' + rx + ry, 256, (g, s) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 90; i++) {
      const y = Math.random() * s;
      const a = 0.03 + Math.random() * 0.09;
      g.strokeStyle = 'rgba(70,42,18,' + a.toFixed(3) + ')';
      g.lineWidth = 0.6 + Math.random() * 2.2;
      g.beginPath();
      g.moveTo(-10, y);
      for (let x = -10; x < s + 10; x += 16) {
        g.lineTo(x, y + Math.sin(x * 0.05 + i) * 2.2 + (Math.random() - 0.5) * 1.6);
      }
      g.stroke();
    }
    for (let i = 0; i < 5; i++) {           // knots
      const kx = Math.random() * s, ky = Math.random() * s;
      for (let r = 2; r < 14; r += 2.2) {
        g.strokeStyle = 'rgba(70,42,18,0.10)';
        g.lineWidth = 1.1;
        g.beginPath();
        g.ellipse(kx, ky, r, r * 0.45, Math.random(), 0, Math.PI * 2);
        g.stroke();
      }
    }
  }, rx, ry);
}

function fabricTex(THREE, rx, ry) {
  return canvasTex(THREE, 'fab' + rx + ry, 128, (g, s) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 2) {
      for (let x = 0; x < s; x += 2) {
        const v = 0.05 + Math.random() * 0.07;
        g.fillStyle = 'rgba(60,48,34,' + ((x + y) % 4 === 0 ? v : v * 0.4).toFixed(3) + ')';
        g.fillRect(x, y, 2, 2);
      }
    }
  }, rx, ry);
}

function pileTex(THREE, rx, ry) {
  return canvasTex(THREE, 'pile' + rx + ry, 128, (g, s) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = 'rgba(70,58,42,' + (0.03 + Math.random() * 0.10).toFixed(3) + ')';
      g.fillRect(Math.random() * s, Math.random() * s, 1.6, 1.6);
    }
  }, rx, ry);
}

function plasterTex(THREE, rx, ry) {
  return canvasTex(THREE, 'plas' + rx + ry, 256, (g, s) => {
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, s, s);
    for (let i = 0; i < 260; i++) {
      const r = 6 + Math.random() * 34;
      g.fillStyle = 'rgba(80,66,48,' + (0.010 + Math.random() * 0.022).toFixed(3) + ')';
      g.beginPath();
      g.arc(Math.random() * s, Math.random() * s, r, 0, Math.PI * 2);
      g.fill();
    }
  }, rx, ry);
}

// A second, harder ramp. Two steps with a big gap between them reads as metal
// in cel shading — that is how the convention carries material without a
// roughness channel.
let RAMP_HARD = null;
function metalRamp(THREE) {
  if (RAMP_HARD) return RAMP_HARD;
  const steps = [34, 96, 255];
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => {
    data[i * 4] = v; data[i * 4 + 1] = v; data[i * 4 + 2] = v; data[i * 4 + 3] = 255;
  });
  const t = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  RAMP_HARD = t;
  return t;
}

// material by KIND, not just colour
function MK(THREE, color, kind, rx, ry) {
  const o = { color: color, gradientMap: toonRamp(THREE) };
  if (kind === 'wood') o.map = woodTex(THREE, rx || 2, ry || 2);
  else if (kind === 'fabric') o.map = fabricTex(THREE, rx || 3, ry || 3);
  else if (kind === 'pile') o.map = pileTex(THREE, rx || 5, ry || 5);
  else if (kind === 'plaster') o.map = plasterTex(THREE, rx || 2, ry || 2);
  else if (kind === 'metal') o.gradientMap = metalRamp(THREE);
  return new THREE.MeshToonMaterial(o);
}


// Outlines in SCREEN space, not world space.
//
// Pushing geometry out along its normals in world units — the usual inverted
// hull — gives a line whose width changes with distance and camera angle, and
// which balloons at box corners because a corner's averaged normal points down
// the diagonal. That is exactly the "outlines look different when I rotate and
// the shapes look distorted" problem. Offsetting in clip space instead, scaled
// by w, gives a constant pixel width from every angle and never deforms the
// silhouette.
const OUTLINE_VS = `
  uniform float thickness;
  uniform vec2 res;
  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vec2 off = (projectionMatrix * vec4(n, 0.0)).xy;
    float l = length(off);
    if (l > 0.00001) {
      clip.xy += (off / l) * (thickness / res.y) * clip.w * 2.0;
    }
    gl_Position = clip;
  }`;
const OUTLINE_FS = 'uniform vec3 ink; void main(){ gl_FragColor = vec4(ink, 1.0); }';

const OUTLINE_MATS = [];
function outlineMaterial(THREE, px) {
  const m = new THREE.ShaderMaterial({
    uniforms: {
      thickness: { value: px },
      ink: { value: new THREE.Color(INK) },
      res: { value: new THREE.Vector2(1440, 810) },
    },
    vertexShader: OUTLINE_VS,
    fragmentShader: OUTLINE_FS,
    side: THREE.BackSide,
  });
  OUTLINE_MATS.push(m);
  return m;
}

// The hull still needs smooth normals, or a bevelled seam leaves a gap and the
// line comes out dashed — but now we only REPLACE the normals, never move the
// vertices, so the outline mesh is the same shape as the object.
function smoothNormals(THREE, src) {
  const geo = src.clone();
  const pos = geo.attributes.position;
  const nor = geo.attributes.normal;
  if (!pos || !nor) return null;
  const avg = new Map();
  const key = (i) => (
    Math.round(pos.getX(i) * 2000) + ',' +
    Math.round(pos.getY(i) * 2000) + ',' +
    Math.round(pos.getZ(i) * 2000)
  );
  for (let i = 0; i < pos.count; i++) {
    const k = key(i);
    let a = avg.get(k);
    if (!a) { a = [0, 0, 0]; avg.set(k, a); }
    a[0] += nor.getX(i); a[1] += nor.getY(i); a[2] += nor.getZ(i);
  }
  for (let i = 0; i < pos.count; i++) {
    const a = avg.get(key(i));
    const len = Math.hypot(a[0], a[1], a[2]) || 1;
    nor.setXYZ(i, a[0] / len, a[1] / len, a[2] / len);
  }
  nor.needsUpdate = true;
  return geo;
}

const EDGE_MAT = { m: null };
function edgeMaterial(THREE) {
  if (!EDGE_MAT.m) {
    EDGE_MAT.m = new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.42 });
  }
  return EDGE_MAT.m;
}

function inkScene(THREE, root, px) {
  const skip = new Set();
  root.traverse((n) => { if (n.userData.noInk) n.traverse((c) => skip.add(c)); });
  const todo = [];
  root.traverse((n) => {
    if (!n.isMesh || n.userData.isOutline || skip.has(n)) return;
    if (!n.geometry.boundingSphere) n.geometry.computeBoundingSphere();
    if (n.geometry.boundingSphere.radius < 0.03) return;
    todo.push(n);
  });
  todo.forEach((n) => {
    const geo = smoothNormals(THREE, n.geometry);
    if (geo) {
      const o = new THREE.Mesh(geo, outlineMaterial(THREE, px));
      o.castShadow = false;
      o.receiveShadow = false;
      o.userData.isOutline = true;
      n.add(o);
    }
    // creases: only genuine hard edges, so a sphere or a smooth curve stays clean
    const eg = new THREE.EdgesGeometry(n.geometry, 32);
    if (eg.attributes.position && eg.attributes.position.count) {
      const ls = new THREE.LineSegments(eg, edgeMaterial(THREE));
      ls.userData.isOutline = true;
      n.add(ls);
    }
  });
  return todo.length;
}

// ---------------------------------------------------------------------------
// Rounded-box primitive. Everything soft in the room — cushions, sofa masses,
// table tops — is an extruded rounded rectangle with a bevel, because a raw
// BoxGeometry corner is the single thing that makes furniture look like a
// programmer's blockout rather than an object.
// ---------------------------------------------------------------------------
function roundedBox(THREE, w, h, d, r, bevel) {
  bevel = bevel == null ? Math.min(0.035, d * 0.2) : bevel;
  r = Math.max(0.001, Math.min(r, w / 2 - 0.001, h / 2 - 0.001));
  const sh = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  sh.moveTo(x + r, y);
  sh.lineTo(x + w - r, y);
  sh.quadraticCurveTo(x + w, y, x + w, y + r);
  sh.lineTo(x + w, y + h - r);
  sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  sh.lineTo(x + r, y + h);
  sh.quadraticCurveTo(x, y + h, x, y + h - r);
  sh.lineTo(x, y + r);
  sh.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: Math.max(0.001, d - bevel * 2), bevelEnabled: true,
    bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 6,
  });
  g.translate(0, 0, -d / 2 + bevel);
  g.computeVertexNormals();
  return g;
}

function mesh(THREE, geo, mat, x, y, z, tag) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  if (tag) m.userData.hit = tag;
  return m;
}

function lerp(a, b, t) { return a + (b - a) * t; }
function mixHex(THREE, a, b, t) {
  const ca = new THREE.Color(a), cb = new THREE.Color(b);
  return ca.lerp(cb, t);
}

// A plank floor: real separate boxes, so the seams catch the light instead of
// being drawn on. Cheap enough at this count and it reads immediately.
function makeFloor(THREE, mat) {
  const g = new THREE.Group();
  const d = R.z1 - R.z0;
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(R.x1 - R.x0, 0.12, d),
    new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 1 })
  );
  slab.position.set((R.x0 + R.x1) / 2, -0.09, (R.z0 + R.z1) / 2);
  slab.receiveShadow = true;
  slab.userData.noInk = true;
  g.add(slab);
  const plank = 0.30;
  let x = R.x0;
  let i = 0;
  while (x < R.x1) {
    const w = Math.min(plank, R.x1 - x);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w * 0.97, 0.06, d), mat[i % mat.length]);
    m.position.set(x + w / 2, -0.03, (R.z0 + R.z1) / 2);
    m.receiveShadow = true;
    m.userData.noInk = true;
    g.add(m);
    x += w; i++;
  }
  return g;
}

// The window is a hole, not a picture: a frame built from four boxes plus
// mullions, with the outside world actually sitting behind it in space.
function makeWindow(THREE, palette, dark) {
  const g = new THREE.Group();
  const x0 = -3.55, x1 = -0.05, y0 = 0.30, y1 = 2.62;
  const frameMat = MK(THREE, 0x232120, 'metal');
  const t = 0.09;

  const bar = (w, h, x, y) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.13), frameMat);
    m.position.set(x, y, R.z0 + 0.07);
    m.castShadow = true;
    g.add(m);
  };
  bar(x1 - x0 + t, t, (x0 + x1) / 2, y0);
  bar(x1 - x0 + t, t, (x0 + x1) / 2, y1);
  bar(t, y1 - y0, x0, (y0 + y1) / 2);
  bar(t, y1 - y0, x1, (y0 + y1) / 2);
  // two mullions -> three panes, as in the reference
  bar(t * 0.7, y1 - y0, lerp(x0, x1, 0.42), (y0 + y1) / 2);
  bar(t * 0.7, y1 - y0, lerp(x0, x1, 0.72), (y0 + y1) / 2);

  // faint glass so the opening still reads as glazed
  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(x1 - x0, y1 - y0),
    new THREE.MeshPhysicalMaterial({
      color: dark ? 0x33507a : 0xbcd6ea, transparent: true, opacity: 0.10,
      roughness: 0.08, metalness: 0, side: THREE.DoubleSide,
    })
  );
  glass.position.set((x0 + x1) / 2, (y0 + y1) / 2, R.z0 + 0.02);
  glass.userData.noInk = true;
  glass.material.fog = false;
  g.add(glass);
  return { group: g, rect: { x0, x1, y0, y1 } };
}

// Everything beyond the glass: sky card far back, then real building boxes and
// tree masses at staggered depths so moving the camera gives parallax.
function makeOutside(THREE, p, dark, rand) {
  const g = new THREE.Group();
  g.userData.noInk = true;
  const skyCol = new THREE.Color(p.sky[1]);

  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 80),
    new THREE.ShaderMaterial({
      uniforms: {
        top: { value: new THREE.Color(p.sky[0]) },
        bot: { value: new THREE.Color(p.sky[1]) },
      },
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec2 vUv; uniform vec3 top; uniform vec3 bot; void main(){ gl_FragColor=vec4(mix(bot,top,pow(vUv.y,.7)),1.); }',
      depthWrite: false,
    })
  );
  sky.position.set(-2.0, 14.0, R.z0 - 62);
  g.add(sky);

  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(dark ? 2.0 : 2.6, 30, 24),
    new THREE.MeshBasicMaterial({ color: p.orb })
  );
  orb.position.set(-4.5, 13.5, R.z0 - 66);
  g.add(orb);
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(dark ? 12 : 18, dark ? 12 : 18),
    new THREE.ShaderMaterial({
      uniforms: { tint: { value: new THREE.Color(p.orb) } },
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'varying vec2 vUv; uniform vec3 tint; void main(){ float r=length(vUv*2.-1.); gl_FragColor=vec4(tint, pow(max(0.,1.-r),2.4)*0.45); }',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
  );
  halo.position.copy(orb.position);
  halo.position.z += 1.0;
  g.add(halo);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 140),
    new THREE.MeshBasicMaterial({ color: dark ? 0x0f1a17 : 0x4e6135 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, R.z0 - 70);
  g.add(ground);

  // ---- skyline: four ranks, each hazed further toward the sky ---------------
  // Windows are real quads on the facade, dark by day and lit by night, which
  // is most of what makes a distant block read as a building rather than a box.
  const litMat = new THREE.MeshBasicMaterial({ color: 0xffd98a });
  const darkWin = new THREE.MeshBasicMaterial({ color: 0x53627e });
  const RANKS = [
    { z: 30, haze: 0.04, hs: 1.00, n: 15, step: 5.4 },
    { z: 44, haze: 0.18, hs: 1.15, n: 13, step: 7.0 },
    { z: 62, haze: 0.34, hs: 1.35, n: 11, step: 9.4 },
    { z: 86, haze: 0.52, hs: 1.5, n: 9, step: 12.5 },
  ];
  RANKS.forEach((rk) => {
    const z = R.z0 - rk.z;
    for (let i = 0; i < rk.n; i++) {
      const w = rand(3.4, 7.2);
      const h = rand(8, 22) * rk.hs;
      const x = -0.5 - (rk.n * rk.step) / 2 + i * rk.step + rand(-1.2, 1.2);
      const face = new THREE.Color(p.city)
        .lerp(new THREE.Color(rand(0, 1) < 0.5 ? 0x9aa8bf : 0x74839c), dark ? 0.0 : 0.55)
        .lerp(skyCol, rk.haze);
      const b = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 5),
        new THREE.MeshBasicMaterial({ color: face })
      );
      b.position.set(x, h / 2 + 0.6, z);
      g.add(b);

      // a roof cap gives the block an edge instead of a flat silhouette
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.36, rand(0.5, 1.3), 1.2),
        new THREE.MeshBasicMaterial({ color: face.clone().multiplyScalar(0.92) })
      );
      cap.position.set(x + rand(-w * 0.2, w * 0.2), h + 0.9, z);
      g.add(cap);

      if (rk.haze > 0.36) continue;   // too far to resolve windows
      const cols = Math.max(2, Math.floor(w / 0.85));
      const rows = Math.max(3, Math.floor(h / 1.25));
      const wm = dark ? litMat : new THREE.MeshBasicMaterial({
        color: darkWin.color.clone().lerp(skyCol, rk.haze + 0.25),
      });
      for (let c = 0; c < cols; c++) {
        for (let r2 = 0; r2 < rows; r2++) {
          if (dark && rand(0, 1) < 0.52) continue;
          const q = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.58), wm);
          q.position.set(
            x - w / 2 + (c + 0.5) * (w / cols),
            1.2 + (r2 + 0.4) * (h / rows),
            z + 2.51
          );
          g.add(q);
        }
      }
    }
  });

  // a low hedge band closes the bottom of the view
  const hedgeMat = new THREE.MeshStandardMaterial({
    color: dark ? 0x152420 : 0x53702f, roughness: 1, flatShading: true,
  });
  for (let i = 0; i < 120; i++) {
    const r = rand(0.6, 1.15);
    const b3 = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 0), hedgeMat);
    b3.position.set(-30 + i * 0.55 + rand(-0.5, 0.5), rand(-1.4, -0.55), R.z0 - rand(4.5, 9.5));
    b3.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3));
    g.add(b3);
  }

  for (let i = 0; i < 60; i++) {
    const r = rand(0.8, 1.5);
    const b4 = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), hedgeMat);
    b4.position.set(-28 + i * 0.9 + rand(-0.5, 0.5), rand(-0.9, 0.1), R.z0 - rand(11, 15));
    b4.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3));
    g.add(b4);
  }

  // ---- treeline: trunk plus stacked canopy clusters -------------------------
  const trunkMat = new THREE.MeshStandardMaterial({ color: dark ? 0x241d18 : 0x5b4432, roughness: 1 });
  for (let i = 0; i < 54; i++) {
    const x = -26 + i * 1.0 + rand(-0.4, 0.4);
    const z = R.z0 - rand(17, 23);
    const th = rand(2.6, 4.6);
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.17, th, 6), trunkMat);
    t.position.set(x, th / 2, z);
    g.add(t);
    const tone = new THREE.Color(p.tree).lerp(new THREE.Color(dark ? 0x101c18 : 0x9ab84f), rand(0, 0.55));
    const cm = new THREE.MeshStandardMaterial({ color: tone, roughness: 1, flatShading: true });
    const blobs = 3 + Math.floor(rand(0, 3));
    for (let b2 = 0; b2 < blobs; b2++) {
      const r = rand(0.55, 1.05);
      const s2 = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1), cm);
      s2.position.set(x + rand(-0.6, 0.6), th + rand(-0.2, 0.9), z + rand(-0.6, 0.6));
      s2.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3));
      g.add(s2);
    }
  }

  // ---- the same telegraph poles and wires the crowd walked under ------------
  const wireMat = new THREE.LineBasicMaterial({ color: dark ? 0x0d1220 : 0x2f3a4a });
  const poleMat = new THREE.MeshStandardMaterial({ color: dark ? 0x14181f : 0x3a3f47, roughness: 1 });
  const poleXs = [];
  for (let i = 0; i < 7; i++) {
    const x = -19 + i * 6.4 + rand(-0.8, 0.8);
    const z = R.z0 - rand(12.5, 14.5);
    const h = rand(7.5, 9.0);
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.2, h, 0.2), poleMat);
    t.position.set(x, h / 2, z);
    g.add(t);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.13, 0.13), poleMat);
    arm.position.set(x, h - 0.5, z);
    g.add(arm);
    poleXs.push({ x: x, y: h - 0.5, z: z });
  }
  poleXs.sort((a, b) => a.x - b.x);
  for (let i = 0; i + 1 < poleXs.length; i++) {
    const a = poleXs[i], b = poleXs[i + 1];
    for (const dy of [0, -0.34]) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(a.x, a.y + dy, a.z),
        new THREE.Vector3((a.x + b.x) / 2, Math.min(a.y, b.y) + dy - 1.0, (a.z + b.z) / 2),
        new THREE.Vector3(b.x, b.y + dy, b.z)
      );
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(22));
      g.add(new THREE.Line(geo, wireMat));
    }
  }

  // The fog is a depth cue for the ROOM. Everything out here is 30-90m away,
  // so leaving it fogged turned the whole view solid.
  g.traverse((n) => { if (n.material) n.material.fog = false; });
  return g;
}


// ---------------------------------------------------------------------------
// Furniture. Every piece is a small group so it can be raycast as one thing;
// `userData.hit` is the section it opens.
// ---------------------------------------------------------------------------
function M(THREE, color, rough, metal) {
  return new THREE.MeshToonMaterial({ color: color, gradientMap: toonRamp(THREE) });
}

function makeSofa(THREE, dark) {
  const g = new THREE.Group();
  const cream = MK(THREE, dark ? 0xb0a086 : 0xdccaa9, 'fabric', 4, 4);
  const creamLo = MK(THREE, dark ? 0x9e9079 : 0xcdba9a, 'fabric', 4, 4);
  const foot = MK(THREE, 0x2f2a25, 'metal');
  const W = 3.25, D = 1.30;

  // plinth and skirt — the sofa sits on something rather than floating
  g.add(mesh(THREE, roundedBox(THREE, W - 0.1, 0.26, D - 0.08, 0.07), creamLo, 0, 0.25, 0));
  // deep seat platform
  g.add(mesh(THREE, roundedBox(THREE, W - 0.14, 0.20, D - 0.12, 0.09), cream, 0, 0.46, 0));

  // two big plump seat cushions, squashed spheres rather than slabs
  [-1, 1].forEach((sx) => {
    const c = mesh(THREE, roundedBox(THREE, W / 2 - 0.30, 0.30, D - 0.30, 0.14), cream,
      sx * (W / 4 - 0.06), 0.66, 0.05);
    c.scale.set(1, 0.92, 1);
    g.add(c);
  });

  // back: a plump roll plus two cushions leaning on it
  const roll = mesh(THREE, roundedBox(THREE, W, 0.62, 0.42, 0.20), cream, 0, 0.86, -D / 2 + 0.20);
  roll.rotation.x = -0.05;
  g.add(roll);
  [-1, 1].forEach((sx) => {
    const b = mesh(THREE, roundedBox(THREE, W / 2 - 0.34, 0.52, 0.26, 0.15), cream,
      sx * (W / 4 - 0.05), 0.92, -D / 2 + 0.40);
    b.rotation.x = -0.14;
    g.add(b);
  });

  // thick rolled arms
  [-1, 1].forEach((sx) => {
    g.add(mesh(THREE, roundedBox(THREE, 0.36, 0.78, D, 0.17), cream, sx * (W / 2 - 0.18), 0.66, 0));
  });

  // throw pillows and blanket, from the reference
  const p1 = mesh(THREE, roundedBox(THREE, 0.46, 0.46, 0.19, 0.11), MK(THREE, dark ? 0x8a3f24 : 0xbe5730, 'fabric', 2, 2), -0.98, 1.02, -0.16);
  p1.rotation.z = 0.20; g.add(p1);
  const p2 = mesh(THREE, roundedBox(THREE, 0.46, 0.46, 0.19, 0.11), MK(THREE, dark ? 0x22381f : 0x2b4531, 'fabric', 2, 2), 0.66, 1.02, -0.16);
  p2.rotation.z = -0.14; g.add(p2);
  const th = mesh(THREE, roundedBox(THREE, 0.52, 0.92, 0.13, 0.06), MK(THREE, dark ? 0x4a5340 : 0x69764f, 'fabric', 2, 3), -1.32, 0.66, 0.26);
  th.rotation.z = 0.06; g.add(th);

  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    g.add(mesh(THREE, new THREE.CylinderGeometry(0.05, 0.04, 0.16, 8), foot,
      sx * (W / 2 - 0.24), 0.08, sz * (D / 2 - 0.20)));
  });
  return g;
}

function makeRug(THREE, dark) {
  const g = new THREE.Group();
  const base = MK(THREE, dark ? 0xbdb09a : 0xf2e9d4, 'pile', 6, 5);
  const r = mesh(THREE, roundedBox(THREE, 3.3, 2.4, 0.03, 0.04, 0.01), base, 0, 0.015, 0);
  r.rotation.x = -Math.PI / 2;
  r.castShadow = false;
  g.add(r);
  // the dashed grid from the reference
  const line = M(THREE, dark ? 0x3a352c : 0x2f2b23, 1);
  for (let i = -1; i <= 1; i++) {
    for (let d = -6; d <= 6; d++) {
      const q = mesh(THREE, new THREE.BoxGeometry(0.16, 0.005, 0.02), line, d * 0.29, 0.032, i * 0.95);
      q.castShadow = false; q.userData.noInk = true; g.add(q);
    }
    for (let d = -5; d <= 5; d++) {
      const q = mesh(THREE, new THREE.BoxGeometry(0.02, 0.005, 0.16), line, i * 1.3, 0.032, d * 0.26);
      q.castShadow = false; q.userData.noInk = true; g.add(q);
    }
  }
  return g;
}

function makeCoffeeTable(THREE, dark) {
  const g = new THREE.Group();
  const wood = MK(THREE, dark ? 0x6d4423 : 0xa9713f, 'wood', 2, 2);
  const dwood = M(THREE, 0x3a2a1c, 0.7);
  const top = mesh(THREE, new THREE.CylinderGeometry(0.62, 0.62, 0.07, 40), wood, 0, 0.46, 0);
  g.add(top);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    const l = mesh(THREE, new THREE.CylinderGeometry(0.028, 0.018, 0.44, 8), dwood,
      Math.cos(a) * 0.42, 0.22, Math.sin(a) * 0.42);
    l.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12);
    g.add(l);
  }
  // book stack, spines readable as colour bands
  const cols = [0xe8e2d4, 0x2f4a35, 0xc4623a, 0x35507a];
  cols.forEach((c, i) => {
    g.add(mesh(THREE, roundedBox(THREE, 0.34, 0.045, 0.24, 0.012), M(THREE, c, 0.85),
      0.16, 0.52 + i * 0.048, -0.05));
  });
  // mug
  const mug = mesh(THREE, new THREE.CylinderGeometry(0.045, 0.04, 0.09, 16), M(THREE, 0x1e1c1a, 0.55), -0.18, 0.545, 0.14);
  g.add(mug);
  const handle = mesh(THREE, new THREE.TorusGeometry(0.032, 0.009, 8, 14, Math.PI), M(THREE, 0x1e1c1a, 0.55), -0.23, 0.545, 0.14);
  handle.rotation.y = Math.PI / 2; g.add(handle);
  // little plant
  g.add(makePlant(THREE, dark, 0.26, -0.22, 0.5, -0.18, 5));
  return g;
}

// A leaf blade: a pointed ellipse, extruded thin. Rounded boxes standing on
// end read as paddles, which is what made the earlier plants look absurd.
function leafGeo(THREE, len, wid) {
  const sh = new THREE.Shape();
  sh.moveTo(0, 0);
  sh.bezierCurveTo(wid * 0.62, len * 0.16, wid * 0.52, len * 0.74, 0, len);
  sh.bezierCurveTo(-wid * 0.52, len * 0.74, -wid * 0.62, len * 0.16, 0, 0);
  const g = new THREE.ExtrudeGeometry(sh, {
    depth: 0.012, bevelEnabled: true, bevelSize: 0.008,
    bevelThickness: 0.006, bevelSegments: 1, curveSegments: 10,
  });
  g.computeVertexNormals();
  return g;
}

// Each leaf rides its own stem, leaning out from the pot and drooping at the
// tip — that arc is the whole difference between a houseplant and a bundle of
// green sticks.
function makePlant(THREE, dark, scale, x, y, z, seedIn) {
  const g = new THREE.Group();
  const potM = MK(THREE, dark ? 0xa79d8d : 0xe8e0cf, 'plaster', 1, 1);
  const soilM = M(THREE, dark ? 0x231a12 : 0x3a2a1c);
  const stemM = M(THREE, dark ? 0x1e3520 : 0x386030);

  const pot = mesh(THREE, new THREE.CylinderGeometry(0.30, 0.22, 0.34, 18), potM, 0, 0.17, 0);
  g.add(pot);
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.31, 0.31, 0.05, 18), potM, 0, 0.33, 0));
  const soil = mesh(THREE, new THREE.CylinderGeometry(0.27, 0.27, 0.03, 16), soilM, 0, 0.345, 0);
  soil.userData.noInk = true;
  g.add(soil);

  let sd = (seedIn || 11) * 7919;
  const rr = () => { sd = (sd * 1103515245 + 12345) & 0x7fffffff; return (sd % 10000) / 10000; };

  const n = 8 + Math.floor(rr() * 4);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rr() * 0.5;
    const lean = 0.22 + rr() * 0.55;
    const stemLen = 0.42 + rr() * 0.62;
    const len = 0.34 + rr() * 0.30;
    const wid = 0.20 + rr() * 0.14;

    const arm = new THREE.Group();
    arm.rotation.y = a;
    const tilt = new THREE.Group();
    tilt.rotation.z = lean;
    tilt.position.y = 0.34;

    const stem = mesh(THREE, new THREE.CylinderGeometry(0.012, 0.018, stemLen, 6), stemM, 0, stemLen / 2, 0);
    tilt.add(stem);

    const tone = new THREE.Color(dark ? 0x1d3a22 : 0x3f6b39)
      .lerp(new THREE.Color(dark ? 0x2f5a33 : 0x74a447), rr() * 0.7);
    const blade = new THREE.Mesh(leafGeo(THREE, len, wid), M(THREE, tone.getHex()));
    blade.castShadow = true;
    blade.receiveShadow = true;
    blade.position.y = stemLen;
    // droop at the tip, plus a little roll so no two leaves face the same way
    blade.rotation.x = -0.55 - rr() * 0.7;
    blade.rotation.z = (rr() - 0.5) * 0.5;
    tilt.add(blade);

    arm.add(tilt);
    g.add(arm);
  }

  g.scale.setScalar(scale);
  g.position.set(x, y, z);
  return g;
}

function makeDesk(THREE, dark) {
  const g = new THREE.Group();
  const wood = MK(THREE, dark ? 0x6d4423 : 0xa9713f, 'wood', 3, 1);
  const black = MK(THREE, 0x2a2725, 'metal');
  const W = 2.9, D = 0.72, H = 0.76;
  g.add(mesh(THREE, roundedBox(THREE, W, 0.06, D, 0.02), wood, 0, H, 0, 'work'));
  // trestle legs
  [-1, 1].forEach((sx) => {
    const x = sx * (W / 2 - 0.28);
    [[-1, 0.16], [1, 0.16]].forEach(([sz]) => {
      const l = mesh(THREE, new THREE.BoxGeometry(0.05, H, 0.05), black, x, H / 2, sz * (D / 2 - 0.09));
      l.rotation.x = sz * 0.08;
      g.add(l);
    });
    g.add(mesh(THREE, new THREE.BoxGeometry(0.05, 0.05, D - 0.1), black, x, H - 0.16, 0));
  });
  // monitor
  g.add(mesh(THREE, new THREE.BoxGeometry(0.22, 0.02, 0.16), black, -0.15, H + 0.04, -0.16));
  g.add(mesh(THREE, new THREE.BoxGeometry(0.05, 0.17, 0.05), black, -0.15, H + 0.12, -0.16));
  const panel = mesh(THREE, roundedBox(THREE, 0.76, 0.45, 0.04, 0.02), black, -0.15, H + 0.42, -0.16, 'work');
  g.add(panel);
  const screen = mesh(THREE, new THREE.PlaneGeometry(0.70, 0.39),
    new THREE.MeshBasicMaterial({ color: dark ? 0x1d2b3a : 0x14171c }), -0.15, H + 0.42, -0.135, 'work');
  screen.castShadow = false;
  g.add(screen);
  // desk lamp: base, arm, head
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.09, 0.10, 0.03, 16), black, -1.12, H + 0.03, -0.14));
  const arm = mesh(THREE, new THREE.CylinderGeometry(0.016, 0.016, 0.52, 8), black, -1.12, H + 0.28, -0.14);
  arm.rotation.z = 0.28; g.add(arm);
  const head = mesh(THREE, new THREE.ConeGeometry(0.10, 0.16, 14, 1, true), black, -0.98, H + 0.53, -0.14);
  head.rotation.set(0.5, 0, 0.6); g.add(head);
  // pen pots and a couple of books
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.055, 0.05, 0.13, 12), black, -0.72, H + 0.07, -0.02));
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.055, 0.05, 0.13, 12), black, 0.52, H + 0.07, -0.04));
  [0x35507a, 0xc4623a].forEach((c, i) => {
    g.add(mesh(THREE, roundedBox(THREE, 0.30, 0.04, 0.22, 0.01), M(THREE, c, 0.85), 0.95, H + 0.05 + i * 0.043, 0));
  });
  return g;
}

function makeChair(THREE, dark) {
  const g = new THREE.Group();
  const tan = M(THREE, dark ? 0x6f4326 : 0xa9663c, 0.8);
  const black = MK(THREE, 0x26231f, 'metal');
  g.add(mesh(THREE, roundedBox(THREE, 0.52, 0.09, 0.50, 0.06), tan, 0, 0.50, 0));
  const back = mesh(THREE, roundedBox(THREE, 0.50, 0.52, 0.08, 0.07), tan, 0, 0.80, -0.24);
  back.rotation.x = -0.12; g.add(back);
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.045, 0.045, 0.34, 10), black, 0, 0.30, 0));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const leg = mesh(THREE, new THREE.BoxGeometry(0.30, 0.035, 0.05), black,
      Math.cos(a) * 0.15, 0.10, Math.sin(a) * 0.15);
    leg.rotation.y = -a; g.add(leg);
    g.add(mesh(THREE, new THREE.CylinderGeometry(0.035, 0.035, 0.05, 8), black,
      Math.cos(a) * 0.30, 0.045, Math.sin(a) * 0.30));
  }
  return g;
}

function makeShelf(THREE, dark, rand) {
  const g = new THREE.Group();
  const wood = MK(THREE, dark ? 0x5c3a20 : 0x8a5a32, 'wood', 2, 2);
  const W = 1.5, H = 2.35, D = 0.34;
  [-1, 1].forEach((sx) => {
    g.add(mesh(THREE, new THREE.BoxGeometry(0.05, H, D), wood, sx * W / 2, H / 2, 0));
  });
  const spineCols = [0x8c2f2a, 0x2f4a35, 0x35507a, 0xc98a2e, 0xe8e2d4, 0x4a3b6b, 0x7a4a2a];
  for (let i = 0; i < 5; i++) {
    const y = 0.24 + i * 0.5;
    g.add(mesh(THREE, new THREE.BoxGeometry(W, 0.04, D), wood, 0, y, 0, 'about'));
    shelfBooks(THREE, g, rand, -W / 2 + 0.08, W / 2 - 0.08, y, D, spineCols);
  }
  g.add(mesh(THREE, new THREE.BoxGeometry(W + 0.05, 0.05, D), wood, 0, H, 0));
  return g;
}

function makeSideboard(THREE, dark) {
  const g = new THREE.Group();
  const wood = MK(THREE, dark ? 0x5c3a20 : 0x8a5a32, 'wood', 2, 2);
  const W = 1.5, H = 0.82, D = 0.46;
  g.add(mesh(THREE, roundedBox(THREE, W, H, D, 0.03), wood, 0, H / 2 + 0.1, 0));
  [-1, 1].forEach((sx) => {
    g.add(mesh(THREE, roundedBox(THREE, W / 2 - 0.06, H - 0.14, 0.03, 0.02),
      M(THREE, dark ? 0x4a2f1a : 0x764c2a, 0.75), sx * W / 4, H / 2 + 0.1, D / 2 + 0.01));
    g.add(mesh(THREE, new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8),
      M(THREE, 0x2a2320, 0.5, 0.3), sx * 0.08, H / 2 + 0.1, D / 2 + 0.03));
  });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    g.add(mesh(THREE, new THREE.CylinderGeometry(0.03, 0.02, 0.12, 8),
      M(THREE, 0x2a2320, 0.6), sx * (W / 2 - 0.12), 0.06, sz * (D / 2 - 0.08)));
  });
  // globe lamp
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.09, 0.11, 0.05, 14), M(THREE, 0x2a2320, 0.5), -0.42, H + 0.14, 0));
  const globe = new THREE.Mesh(new THREE.SphereGeometry(0.13, 22, 16),
    new THREE.MeshToonMaterial({
      color: 0xfff2d8, gradientMap: toonRamp(THREE),
      emissive: new THREE.Color(dark ? 0xffca80 : 0x2a2418),
      emissiveIntensity: dark ? 1.5 : 0.2,
    }));
  globe.position.set(-0.42, H + 0.28, 0);
  g.add(globe);
  return g;
}

function makeGuitar(THREE, dark) {
  const g = new THREE.Group();
  const body = M(THREE, dark ? 0xa8752f : 0xd9a044);
  const dk = M(THREE, dark ? 0x2c1f13 : 0x4a3320);
  // lower and upper bout as two overlapping rounded masses
  const lower = mesh(THREE, roundedBox(THREE, 0.40, 0.44, 0.13, 0.19), body, 0, 0.24, 0);
  g.add(lower);
  const upper = mesh(THREE, roundedBox(THREE, 0.32, 0.34, 0.12, 0.15), body, 0, 0.56, 0);
  g.add(upper);
  const waist = mesh(THREE, roundedBox(THREE, 0.26, 0.16, 0.125, 0.07), body, 0, 0.42, 0);
  g.add(waist);
  // sound hole
  const hole = mesh(THREE, new THREE.CylinderGeometry(0.065, 0.065, 0.02, 20), dk, 0, 0.38, 0.065);
  hole.rotation.x = Math.PI / 2;
  g.add(hole);
  // neck, fretboard, head
  g.add(mesh(THREE, roundedBox(THREE, 0.075, 0.62, 0.055, 0.02), dk, 0, 1.02, 0.01));
  g.add(mesh(THREE, roundedBox(THREE, 0.10, 0.15, 0.05, 0.02), dk, 0, 1.38, 0.01));
  g.rotation.z = 0.16;
  return g;
}

function makeRecordPlayer(THREE, dark) {
  const g = new THREE.Group();
  const wood = MK(THREE, dark ? 0x5c3a20 : 0x8a5a32, 'wood', 2, 2);
  const dk = MK(THREE, 0x26231f, 'metal');
  // low stand
  g.add(mesh(THREE, roundedBox(THREE, 0.82, 0.05, 0.46, 0.02), wood, 0, 0.44, 0));
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    g.add(mesh(THREE, new THREE.CylinderGeometry(0.022, 0.016, 0.44, 8), dk,
      sx * 0.34, 0.22, sz * 0.17));
  });
  // deck
  g.add(mesh(THREE, roundedBox(THREE, 0.58, 0.09, 0.40, 0.02), M(THREE, dark ? 0x3a352f : 0x585049), 0, 0.51, 0));
  const platter = mesh(THREE, new THREE.CylinderGeometry(0.20, 0.20, 0.02, 28), MK(THREE, 0x2b2825, 'metal'), -0.04, 0.545, 0);
  g.add(platter);
  g.userData.platter = platter;
  const label = mesh(THREE, new THREE.CylinderGeometry(0.055, 0.055, 0.023, 20), M(THREE, dark ? 0xc9942a : 0xe0b13c), -0.04, 0.548, 0);
  g.add(label);
  g.userData.label = label;
  // tonearm
  const arm = mesh(THREE, new THREE.CylinderGeometry(0.008, 0.008, 0.30, 6), MK(THREE, 0x9a9aa0, 'metal'), 0.16, 0.575, -0.06);
  arm.rotation.set(0, 0.5, Math.PI / 2);
  g.add(arm);
  // the "Good Music Better Days" card, propped
  const card = mesh(THREE, roundedBox(THREE, 0.34, 0.40, 0.02, 0.01), M(THREE, dark ? 0x2a2620 : 0x2f2b25), 0.30, 0.72, -0.16);
  card.rotation.x = -0.12;
  g.add(card);
  return g;
}

function makeBeanbag(THREE, dark) {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(0.52, 20, 14);
  geo.scale(1.15, 0.72, 1.0);
  const b = new THREE.Mesh(geo, M(THREE, dark ? 0x8a4526 : 0xc4623a));
  b.position.y = 0.36;
  b.castShadow = true; b.receiveShadow = true;
  g.add(b);
  // a couple of books beside it
  [0x35507a, 0xe8e2d4].forEach((c, i) => {
    g.add(mesh(THREE, roundedBox(THREE, 0.34, 0.05, 0.26, 0.012), M(THREE, c), 0.62, 0.03 + i * 0.052, 0.18));
  });
  return g;
}

// wall shelves over the desk, with book rows and trailing vines
function shelfBooks(THREE, g, rand, x0, x1, y, depth, spines) {
  let x = x0;
  while (x < x1 - 0.05) {
    const roll = rand(0, 1);
    if (roll < 0.13) { x += 0.06 + rand(0, 0.08); continue; }          // gap
    if (roll < 0.24) {                                                  // flat stack
      const n = 2 + Math.floor(rand(0, 3));
      const w = 0.20 + rand(0, 0.06);
      for (let k = 0; k < n; k++) {
        g.add(mesh(THREE, roundedBox(THREE, w, 0.035, depth - 0.04, 0.008),
          M(THREE, spines[Math.floor(rand(0, spines.length))]), x + w / 2, y + 0.02 + k * 0.037, 0));
      }
      x += w + 0.03;
      continue;
    }
    const bw = 0.030 + rand(0, 0.048);
    const bh = 0.17 + rand(0, 0.16);
    const b = mesh(THREE, roundedBox(THREE, bw, bh, depth - 0.05, 0.007),
      M(THREE, spines[Math.floor(rand(0, spines.length))]), x + bw / 2, y + 0.02 + bh / 2, 0);
    if (roll > 0.93) { b.rotation.z = 0.22; b.position.y -= 0.012; }   // leaner
    g.add(b);
    x += bw + 0.006;
  }
}

function makeWallShelf(THREE, dark, rand) {
  const g = new THREE.Group();
  const wood = MK(THREE, dark ? 0x5c3a20 : 0x8a5a32, 'wood', 2, 2);
  const spines = [0x8c2f2a, 0x2f4a35, 0x35507a, 0xc98a2e, 0xe8e2d4, 0x4a3b6b, 0x7a4a2a, 0x2f6b6b];
  [0, 1].forEach((row) => {
    const y = row * 0.48;
    g.add(mesh(THREE, roundedBox(THREE, 2.1, 0.05, 0.26, 0.015), wood, 0, y, 0));
    shelfBooks(THREE, g, rand, -0.72, 0.98, y, 0.26, spines);

    const pot = mesh(THREE, new THREE.CylinderGeometry(0.10, 0.08, 0.12, 12), M(THREE, dark ? 0xa79d8d : 0xe4dccb), -0.86, y + 0.09, 0);
    g.add(pot);
    const vine = M(THREE, dark ? 0x24402a : 0x3f6b39);
    for (let i = 0; i < 6; i++) {
      const len = 0.14 + rand(0, 0.36);
      const v = mesh(THREE, roundedBox(THREE, 0.045, len, 0.02, 0.02), vine,
        -0.86 + rand(-0.09, 0.09), y - len / 2 + 0.02, rand(-0.06, 0.09));
      v.rotation.z = rand(-0.35, 0.35);
      g.add(v);
    }
  });
  return g;
}

// ---------------------------------------------------------------------------
// The shaft of light through the window, and the dust hanging in it. This is
// the single element that turns a lit room into an atmosphere — everything
// else here is refinement by comparison.
// ---------------------------------------------------------------------------
function makeShaft(THREE, rect, dir, len, tint, strength) {
  const near = [
    [rect.x0, rect.y0], [rect.x1, rect.y0], [rect.x1, rect.y1], [rect.x0, rect.y1],
  ].map(([x, y]) => new THREE.Vector3(x, y, R.z0 + 0.12));
  const far = near.map((v) => v.clone().addScaledVector(dir, len));

  const pos = [];
  const fade = [];
  const quad = (a, b, c, d, fa, fb, fc, fd) => {
    pos.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    pos.push(a.x, a.y, a.z, c.x, c.y, c.z, d.x, d.y, d.z);
    fade.push(fa, fb, fc, fa, fc, fd);
  };
  for (let i = 0; i < 4; i++) {
    const j = (i + 1) % 4;
    quad(near[i], near[j], far[j], far[i], 0, 0, 1, 1);
  }
  quad(far[0], far[1], far[2], far[3], 1, 1, 1, 1);   // soft cap where it lands

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('fade', new THREE.Float32BufferAttribute(fade, 1));

  const mat = new THREE.ShaderMaterial({
    uniforms: { tint: { value: new THREE.Color(tint) }, strength: { value: strength } },
    vertexShader: `
      attribute float fade;
      varying float vF;
      void main(){ vF = fade; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 tint; uniform float strength; varying float vF;
      void main(){ gl_FragColor = vec4(tint, pow(1.0 - vF, 1.7) * strength); }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const m = new THREE.Mesh(geo, mat);
  m.userData.noInk = true;
  m.renderOrder = 5;
  return m;
}

function makeMotes(THREE, rect, dir, len, count, tint) {
  const pos = [];
  const seedBase = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random(), v = Math.random(), t = Math.pow(Math.random(), 0.75);
    const p0 = new THREE.Vector3(
      rect.x0 + (rect.x1 - rect.x0) * u,
      rect.y0 + (rect.y1 - rect.y0) * v,
      R.z0 + 0.2
    ).addScaledVector(dir, len * t);
    pos.push(p0.x, p0.y, p0.z);
    seedBase.push(Math.random() * 6.283);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('ph', new THREE.Float32BufferAttribute(seedBase, 1));
  const mat = new THREE.ShaderMaterial({
    uniforms: { t: { value: 0 }, tint: { value: new THREE.Color(tint) }, size: { value: 2.6 } },
    vertexShader: `
      attribute float ph; uniform float t; uniform float size; varying float vA;
      void main(){
        vec3 p = position;
        p.y += sin(t * 0.30 + ph) * 0.10;
        p.x += cos(t * 0.22 + ph * 1.7) * 0.09;
        vA = 0.45 + 0.55 * sin(t * 0.9 + ph * 3.1);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * (7.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 tint; varying float vA;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(tint, (1.0 - d * 2.0) * vA * 0.85);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(geo, mat);
  pts.userData.noInk = true;
  pts.renderOrder = 6;
  return { points: pts, mat: mat };
}

// A soft dark ellipse under each object. Without it everything floats on the
// floor instead of sitting in the room.
let AO_TEX = null;
function aoTexture(THREE) {
  if (AO_TEX) return AO_TEX;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 2, 64, 64, 62);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.24)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  AO_TEX = new THREE.CanvasTexture(c);
  return AO_TEX;
}

function contactShadow(THREE, w, d, x, z, op) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({
      map: aoTexture(THREE), transparent: true, depthWrite: false,
      opacity: op == null ? 0.9 : op,
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, 0.012, z);
  m.userData.noInk = true;
  m.renderOrder = 1;
  return m;
}

function makePendant(THREE, dark) {
  const g = new THREE.Group();
  const dk = MK(THREE, 0x2a2725, 'metal');
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.008, 0.008, 1.05, 6), dk, 0, 0.52, 0));
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.07, 0.07, 0.04, 14), dk, 0, 1.04, 0));
  const shade = mesh(THREE, new THREE.ConeGeometry(0.30, 0.26, 22, 1, true), dk, 0, -0.13, 0);
  g.add(shade);
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.085, 16, 12),
    new THREE.MeshToonMaterial({
      color: 0xfff3d4, gradientMap: toonRamp(THREE),
      emissive: new THREE.Color(dark ? 0xffc879 : 0x4a4028),
      emissiveIntensity: dark ? 1.7 : 0.5,
    })
  );
  bulb.position.y = -0.20;
  bulb.userData.noInk = true;
  g.add(bulb);
  return g;
}

// One of the crowd, sat at the desk with their back to us. Same palette as the
// preloader figures — the whole point is that you walked through a crowd of
// these and one of them turned out to be you.
function makePeepSeated(THREE, dark) {
  const g = new THREE.Group();
  const skin = M(THREE, dark ? 0xa86b41 : 0xc98d5f);
  const shirt = M(THREE, dark ? 0x3f4ea8 : 0x4d9bd6);
  const hair = M(THREE, INK);
  const jeans = M(THREE, dark ? 0x2f3038 : 0x3f4550);

  // seat and thighs
  g.add(mesh(THREE, roundedBox(THREE, 0.42, 0.16, 0.44, 0.07), jeans, 0, 0.60, 0.04));
  [-1, 1].forEach((sx) => {
    g.add(mesh(THREE, roundedBox(THREE, 0.15, 0.15, 0.44, 0.07), jeans, sx * 0.12, 0.52, -0.24));
    g.add(mesh(THREE, roundedBox(THREE, 0.13, 0.42, 0.14, 0.06), jeans, sx * 0.12, 0.28, -0.42));
  });
  // torso, tapering to the shoulders
  const torso = mesh(THREE, roundedBox(THREE, 0.50, 0.56, 0.32, 0.13), shirt, 0, 0.96, 0.02);
  torso.rotation.x = 0.10;
  g.add(torso);
  // arms reaching forward onto the desk
  [-1, 1].forEach((sx) => {
    const up = mesh(THREE, roundedBox(THREE, 0.14, 0.34, 0.15, 0.065), shirt, sx * 0.28, 1.00, -0.02);
    up.rotation.x = 0.55;
    g.add(up);
    const fore = mesh(THREE, roundedBox(THREE, 0.12, 0.36, 0.13, 0.055), skin, sx * 0.30, 0.84, -0.30);
    fore.rotation.x = 1.15;
    g.add(fore);
  });
  // neck, head, hair
  g.add(mesh(THREE, new THREE.CylinderGeometry(0.055, 0.065, 0.09, 10), skin, 0, 1.27, -0.01));
  const head = mesh(THREE, roundedBox(THREE, 0.27, 0.32, 0.26, 0.12), skin, 0, 1.45, -0.01);
  g.add(head);
  const cap = mesh(THREE, roundedBox(THREE, 0.29, 0.22, 0.28, 0.12), hair, 0, 1.52, 0.005);
  g.add(cap);
  g.add(mesh(THREE, roundedBox(THREE, 0.28, 0.13, 0.10, 0.05), hair, 0, 1.37, 0.10));
  return g;
}

// Big leaves cutting into the near corners. A photographic framing device —
// it is what gives the reference its depth and intimacy.
function makeForegroundLeaf(THREE, dark, len, wid, x, y, z, ry, rz, rx) {
  const tone = new THREE.Color(dark ? 0x0e1f14 : 0x1e4420);
  const m = new THREE.Mesh(leafGeo(THREE, len, wid), M(THREE, tone.getHex()));
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.castShadow = false;
  return m;
}

export function buildRoom(opts) {
  const o = opts || {};
  const group = new THREE.Group();
  const fog = new THREE.Fog(
    (o.night ? 0x241d18 : 0xd8c8a8), 7.5, 26);

  let seed = 20260908;
  const rand = (a, b) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return a + (seed / 4294967296) * (b - a);
  };

  const dark = !!o.night;
  const p = dark ? PAL.night : PAL.day;

  // ---- shell ---------------------------------------------------------------
  const wallMat = MK(THREE, p.wall, 'plaster', 3, 2);
  const wallSideMat = MK(THREE, p.wallShade, 'plaster', 3, 2);
  const ceilMat = new THREE.MeshToonMaterial({ color: p.ceiling, gradientMap: toonRamp(THREE) });

  const W = R.x1 - R.x0, D = R.z1 - R.z0;

  // The window sits on the deep wall; the desk wall steps forward from x=0.5,
  // with a return between them. One flat back wall was most of why the room
  // read as a stage set rather than a place.
  const JOG_X = 0.5, JOG_Z = -3.35;
  const deskWallMat = MK(THREE, dark ? 0x60503f : 0xccb992, 'plaster', 2, 2);
  const deskWall = new THREE.Mesh(new THREE.PlaneGeometry(R.x1 - JOG_X, R.y1), deskWallMat);
  deskWall.position.set((JOG_X + R.x1) / 2, R.y1 / 2, JOG_Z);
  deskWall.receiveShadow = true;
  deskWall.userData.noInk = true;
  group.add(deskWall);
  const retWall = new THREE.Mesh(new THREE.PlaneGeometry(JOG_Z - R.z0, R.y1), wallSideMat);
  retWall.rotation.y = -Math.PI / 2;
  retWall.position.set(JOG_X, R.y1 / 2, (R.z0 + JOG_Z) / 2);
  retWall.receiveShadow = true;
  retWall.userData.noInk = true;
  group.add(retWall);
  const soffit = new THREE.Mesh(new THREE.PlaneGeometry(R.x1 - JOG_X, R.z0 - JOG_Z), ceilMat);
  soffit.rotation.x = Math.PI / 2;
  soffit.position.set((JOG_X + R.x1) / 2, R.y1, (R.z0 + JOG_Z) / 2);
  soffit.userData.noInk = true;
  group.add(soffit);

  const left = new THREE.Mesh(new THREE.PlaneGeometry(D, R.y1), wallSideMat);
  left.rotation.y = Math.PI / 2;
  left.position.set(R.x0, R.y1 / 2, (R.z0 + R.z1) / 2);
  left.receiveShadow = true;
  left.userData.noInk = true;
  group.add(left);

  const right = new THREE.Mesh(new THREE.PlaneGeometry(D, R.y1), wallSideMat);
  right.rotation.y = -Math.PI / 2;
  right.position.set(R.x1, R.y1 / 2, (R.z0 + R.z1) / 2);
  right.receiveShadow = true;
  right.userData.noInk = true;
  group.add(right);

  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set((R.x0 + R.x1) / 2, R.y1, (R.z0 + R.z1) / 2);
  ceil.userData.noInk = true;
  group.add(ceil);

  const plankMats = [0, 1, 2, 3].map((i) => new THREE.MeshToonMaterial({
    color: mixHex(THREE, p.floor, dark ? 0x5e3f22 : 0xb0712c, i * 0.13),
    gradientMap: toonRamp(THREE),
    map: (() => { const t = woodTex(THREE, 1, 1).clone();
      t.needsUpdate = true; t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; t.repeat.set(1, 6); return t; })(),
  }));
  group.add(makeFloor(THREE, plankMats));

  // ---- window and the world through it -------------------------------------
  const win = makeWindow(THREE, p, dark);
  group.add(win.group);
  group.add(makeOutside(THREE, p, dark, rand));

  // the deep wall is solid except where the window is, so it is built from
  // side panels plus a header and sill rather than a plane over the view
  const solid = (w, h, x, y) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    m.position.set(x, y, R.z0);
    m.receiveShadow = true;
    m.userData.noInk = true;
    group.add(m);
  };
  const wr = win.rect;
  solid(wr.x0 - R.x0, R.y1, (R.x0 + wr.x0) / 2, R.y1 / 2);
  solid(JOG_X - wr.x1, R.y1, (wr.x1 + JOG_X) / 2, R.y1 / 2);
  solid(wr.x1 - wr.x0, R.y1 - wr.y1, (wr.x0 + wr.x1) / 2, (wr.y1 + R.y1) / 2);
  solid(wr.x1 - wr.x0, wr.y0, (wr.x0 + wr.x1) / 2, wr.y0 / 2);

  // ---- light ---------------------------------------------------------------
  group.add(new THREE.AmbientLight(0xffffff, p.amb));
  group.add(new THREE.HemisphereLight(dark ? 0x39456b : 0x9dbcd8, p.floor, dark ? 0.16 : 0.24));

  // the key comes through the window, from where the orb is
  const key = new THREE.DirectionalLight(p.key, p.keyInt);
  key.position.set(-4.2, 6.4, R.z0 - 7);
  key.target.position.set(0.6, 0.6, 0.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  const sc = key.shadow.camera;
  sc.left = -9; sc.right = 9; sc.top = 9; sc.bottom = -9; sc.near = 1; sc.far = 34;
  key.shadow.bias = -0.0012;
  key.shadow.normalBias = 0.02;
  group.add(key);
  group.add(key.target);

  // lamp fills — carry the whole night set
  const lamps = [];
  const addLamp = (x, y, z, colour, power, dist) => {
    const l = new THREE.PointLight(colour, power * (dark ? 1 : 0.12), dist, 2);
    l.position.set(x, y, z);
    l.castShadow = false;
    group.add(l);
    lamps.push(l);
    return l;
  };
  addLamp(R.x0 + 0.30, 1.22, -3.15 - 0.42, 0xffd9a0, 3.0, 5.6);  // globe lamp
  addLamp(1.45, 1.34, JOG_Z + 0.55, 0xffd39a, 2.6, 4.4);        // desk lamp
  addLamp(0.2, 2.6, -0.4, 0xffe7c8, dark ? 0.5 : 0.2, 8);  // soft room fill
  const bounce = new THREE.DirectionalLight(dark ? 0x6b4f33 : 0xffca7a, dark ? 0.10 : 0.34);
  bounce.position.set(0.4, -2.0, 1.6);
  bounce.target.position.set(0, 1.4, -3);
  group.add(bounce); group.add(bounce.target);

  // ---- furniture -----------------------------------------------------------
  const hits = [];
  const place = (grp, x, z, ry, tag) => {
    grp.position.x = x; grp.position.z = z;
    if (ry) grp.rotation.y = ry;
    if (tag) grp.userData.hit = tag;
    group.add(grp);
    if (tag) hits.push(grp);
    return grp;
  };

  place(makeRug(THREE, dark), -1.15, -1.35, 0.055);
  place(makeSofa(THREE, dark), -1.45, -2.95, 0.04);
  place(makeCoffeeTable(THREE, dark), -1.20, -1.30, 0.14, 'about');
  place(makeDesk(THREE, dark), 2.55, JOG_Z + 0.44, 0, 'work');
  place(makeChair(THREE, dark), 2.35, JOG_Z + 1.32, 0.22);
  place(makeShelf(THREE, dark, rand), R.x1 - 0.20, -2.35, -Math.PI / 2, 'about');
  place(makeSideboard(THREE, dark), R.x0 + 0.30, -3.15, Math.PI / 2);
  // the hero monstera beside the window, and a smaller one by the jog
  group.add(makePlant(THREE, dark, 1.15, -3.75, 0, -3.55, 3));
  group.add(makePlant(THREE, dark, 0.60, -0.18, 0, -3.70, 9));
  group.add(makePlant(THREE, dark, 0.40, R.x0 + 0.55, 0.92, -3.30, 17));

  place(makeGuitar(THREE, dark), 0.92, JOG_Z + 0.30, 0.05, 'experience');
  const rp = place(makeRecordPlayer(THREE, dark), 2.85, -1.15, -0.42, 'contact');
  group.add(place(makeBeanbag(THREE, dark), -3.30, -0.75, 0.4));
  const ws = makeWallShelf(THREE, dark, rand);
  ws.position.set(2.35, 1.98, JOG_Z + 0.14);
  group.add(ws);

  // ---- wall structure ------------------------------------------------------
  // Flat planes in one colour read as a monotone backdrop. Skirting gives the
  // walls a floor line, and the framed prints give them something to be.
  const skirtMat = new THREE.MeshToonMaterial({ color: dark ? 0x8a7a63 : 0xf1e9d9, gradientMap: toonRamp(THREE) });
  const skirt = (w, x, z, ry) => {
    const m = mesh(THREE, roundedBox(THREE, w, 0.16, 0.05, 0.01), skirtMat, x, 0.08, z);
    if (ry) m.rotation.y = ry;
    group.add(m);
  };
  skirt(wr.x0 - R.x0, (R.x0 + wr.x0) / 2, R.z0 + 0.03);
  skirt(JOG_X - wr.x1, (wr.x1 + JOG_X) / 2, R.z0 + 0.03);
  skirt(R.x1 - JOG_X, (JOG_X + R.x1) / 2, JOG_Z + 0.03);
  skirt(R.z1 - R.z0, R.x0 + 0.03, (R.z0 + R.z1) / 2, Math.PI / 2);
  skirt(R.z1 - JOG_Z, R.x1 - 0.03, (JOG_Z + R.z1) / 2, -Math.PI / 2);
  skirt(JOG_Z - R.z0, JOG_X - 0.03, (R.z0 + JOG_Z) / 2, -Math.PI / 2);

  const hang = (w, h, x, y, z, ry, paper) => {
    const g2 = new THREE.Group();
    g2.add(mesh(THREE, roundedBox(THREE, w, h, 0.035, 0.01),
      new THREE.MeshToonMaterial({ color: dark ? 0x3a2d21 : 0x6b543a, gradientMap: toonRamp(THREE) }), 0, 0, 0));
    const sheet = mesh(THREE, roundedBox(THREE, w - 0.09, h - 0.09, 0.01, 0.005),
      new THREE.MeshToonMaterial({ color: paper, gradientMap: toonRamp(THREE) }), 0, 0, 0.022);
    sheet.userData.noInk = true;
    g2.add(sheet);
    g2.position.set(x, y, z);
    if (ry) g2.rotation.y = ry;
    group.add(g2);
    return g2;
  };
  hang(0.62, 0.86, R.x0 + 0.06, 1.72, -2.30, Math.PI / 2, dark ? 0xbfb49c : 0xf4eede);
  hang(0.55, 0.75, R.x0 + 0.06, 1.66, -0.70, Math.PI / 2, dark ? 0xb0a894 : 0xeee7d6);
  hang(0.60, 0.82, 1.05, 1.80, JOG_Z + 0.05, 0, dark ? 0xc0b193 : 0xf6e9c8);
  hang(0.44, 0.60, 3.95, 1.84, JOG_Z + 0.05, 0, dark ? 0xb5a894 : 0xf1e9d9);

  // pinned cards over the desk — the wall reads as somebody's wall, not drywall
  const pin = (w, h, x, y, rz, col) => {
    const m = mesh(THREE, roundedBox(THREE, w, h, 0.012, 0.008),
      new THREE.MeshToonMaterial({ color: col, gradientMap: toonRamp(THREE) }), x, y, JOG_Z + 0.03);
    m.rotation.z = rz;
    group.add(m);
  };
  pin(0.26, 0.20, 1.86, 1.62, 0.05, dark ? 0x2c3d55 : 0x3d5a7a);
  pin(0.20, 0.26, 2.18, 1.70, -0.07, dark ? 0xb3a68c : 0xf0e7d2);
  pin(0.30, 0.36, 2.62, 1.60, 0.03, dark ? 0xb59a5f : 0xf2d98f);
  pin(0.18, 0.22, 3.02, 1.72, 0.09, dark ? 0x3a4a3a : 0x53704f);
  pin(0.10, 0.10, 3.30, 1.86, 0, dark ? 0x8a3f24 : 0xc4623a);

  // ---- somebody at the desk ------------------------------------------------
  const peep = makePeepSeated(THREE, dark);
  peep.position.set(2.33, 0, JOG_Z + 1.28);
  peep.rotation.y = Math.PI + 0.22;
  group.add(peep);

  // ---- foreground framing --------------------------------------------------
  // Parented to the CAMERA, not the room. Placing them in world space meant
  // guessing whether they fell inside a frustum that is under a metre wide at
  // that distance — as a camera child they frame the corners by construction,
  // and they hold the frame while the room turns behind them.
  const fg = new THREE.Group();
  const leafAt = (len, wid, x, y, z, rx, ry, rz) => {
    const l = makeForegroundLeaf(THREE, dark, len, wid, x, y, z, ry, rz, rx);
    l.userData.noInk = true;
    fg.add(l);
  };
  leafAt(0.40, 0.21, -0.74, -0.60, -0.95, -0.20, 0.55, 0.72);
  leafAt(0.33, 0.17, -0.83, -0.50, -0.90, -0.12, 1.10, 1.15);
  leafAt(0.28, 0.15, -0.64, -0.64, -0.99, -0.26, 0.20, 0.45);
  leafAt(0.37, 0.19, 0.78, -0.58, -0.96, -0.22, -0.60, -0.74);
  leafAt(0.31, 0.16, 0.87, -0.48, -0.91, -0.10, -1.15, -1.12);
  fg.children.forEach((l) => { l.userData.rz0 = l.rotation.z; });
  // returned as `foreground` — the component attaches it to r3f's camera

  // ---- pendant over the coffee table (also fills the empty ceiling) --------
  const pend = makePendant(THREE, dark);
  pend.position.set(-1.20, R.y1 - 1.06, -1.35);
  group.add(pend);
  addLamp(-1.20, R.y1 - 1.28, -1.35, 0xffd9a0, dark ? 2.4 : 0.5, 4.6);

  // ---- contact shadows -----------------------------------------------------
  [[3.6, 1.7, -1.45, -2.95], [1.5, 1.5, -1.20, -1.30], [3.4, 1.0, 2.55, JOG_Z + 0.55],
   [1.1, 1.1, 2.35, JOG_Z + 1.32], [1.9, 0.9, R.x0 + 0.30, -3.15], [1.0, 1.0, -3.30, -0.75],
   [1.3, 1.3, -3.75, -3.55], [1.1, 0.9, 2.85, -1.15], [0.7, 0.7, 0.92, JOG_Z + 0.30],
   [1.2, 0.7, R.x1 - 0.20, -2.35]].forEach(([w, d, x, z]) => group.add(contactShadow(THREE, w, d, x, z)));

  inkScene(THREE, group, 2.1);

  // ---- the shaft, after inking so it never gets an outline -----------------
  const lightDir = new THREE.Vector3().subVectors(key.target.position, key.position).normalize();
  group.add(makeShaft(THREE, wr, lightDir, 9.5, dark ? 0x9fb6d8 : 0xffe0a0, dark ? 0.06 : 0.34));
  const motes = makeMotes(THREE, wr, lightDir, 8.5, 320, dark ? 0xc8d6ee : 0xfff0cf);
  group.add(motes.points);

  // Everything react-three-fiber needs: the scene contents, the things that
  // move, the raycast targets, and where the camera should sit.
  let clock = 0;
  function update(dt) {
    clock += dt;
    motes.mat.uniforms.t.value = clock;
    if (rp.userData.platter) {
      rp.userData.platter.rotation.y += dt * 1.7;
      if (rp.userData.label) rp.userData.label.rotation.y += dt * 1.7;
    }
    fg.children.forEach((l, i) => {
      l.rotation.z = l.userData.rz0 + Math.sin(clock * 0.55 + i * 1.3) * 0.045;
    });
    pend.rotation.z = Math.sin(clock * 0.42) * 0.012;
  }

  function setOutlineResolution(w, h) {
    OUTLINE_MATS.forEach((m) => m.uniforms.res.value.set(w, h));
  }

  return {
    group,
    fog,
    hits,
    foreground: fg,
    update,
    setOutlineResolution,
    camera: { position: [0.35, 1.86, 3.55], target: [0.10, 1.08, -2.40], fov: 50 },
  };
}
