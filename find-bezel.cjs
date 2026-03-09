const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, 'public/models/room.glb');
const buf = fs.readFileSync(glbPath);

const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonStr);
const binChunkStart = 20 + jsonLen;
const binData = buf.slice(binChunkStart + 8);

function readAccessor(idx) {
  const acc = gltf.accessors[idx];
  const bv = gltf.bufferViews[acc.bufferView];
  const offset = (bv.byteOffset || 0) + (acc.byteOffset || 0);
  const count = acc.count;
  const numComp = acc.type === 'VEC3' ? 3 : acc.type === 'VEC2' ? 2 : 1;
  const stride = bv.byteStride || (numComp * 4);
  const result = [];
  for (let i = 0; i < count; i++) {
    const byteOff = offset + i * stride;
    const v = [];
    for (let c = 0; c < numComp; c++) {
      v.push(binData.readFloatLE(byteOff + c * 4));
    }
    result.push(v);
  }
  return result;
}

// Search all primitives for vertices in the monitor bezel area
// Monitor is roughly at X: 0.2-1.3, Y: 0.1-0.6, Z: -0.9 to -0.4
const mesh = gltf.meshes[0];

console.log('=== Searching for monitor bezel inner edge vertices ===\n');

// For each primitive, find vertices that are near the monitor screen Z plane
// and form a rectangle around the screen area
mesh.primitives.forEach((prim, primIdx) => {
  const positions = readAccessor(prim.attributes.POSITION);
  const matName = prim.material !== undefined ? gltf.materials[prim.material].name : 'none';
  
  // Filter vertices in the monitor screen region
  const monitorVerts = positions.filter(p => 
    p[0] > 0.2 && p[0] < 1.4 && 
    p[1] > 0.05 && p[1] < 0.7 && 
    p[2] > -0.95 && p[2] < -0.40
  );
  
  if (monitorVerts.length > 0) {
    console.log(`Prim ${primIdx} [${matName}]: ${monitorVerts.length} verts in monitor region`);
    
    // Group by Z
    const zGroups = {};
    monitorVerts.forEach(p => {
      const z = p[2].toFixed(3);
      if (!zGroups[z]) zGroups[z] = [];
      zGroups[z].push(p);
    });
    
    Object.keys(zGroups).sort((a,b) => parseFloat(a) - parseFloat(b)).forEach(z => {
      const verts = zGroups[z];
      if (verts.length >= 2) {
        const xs = verts.map(v => v[0]);
        const ys = verts.map(v => v[1]);
        const minX = Math.min(...xs), maxX = Math.max(...xs);
        const minY = Math.min(...ys), maxY = Math.max(...ys);
        const w = maxX - minX;
        const h = maxY - minY;
        if (w > 0.1 || h > 0.1) { // Only show non-trivial spans
          console.log(`  Z=${z}: ${verts.length}v  X=[${minX.toFixed(4)}, ${maxX.toFixed(4)}] Y=[${minY.toFixed(4)}, ${maxY.toFixed(4)}]  size=${w.toFixed(4)}x${h.toFixed(4)}`);
        }
      }
    });
    console.log();
  }
});
