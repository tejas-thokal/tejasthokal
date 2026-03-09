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
  const stride = bv.byteStride || 0;
  const count = acc.count;
  const result = [];
  
  // float32 positions
  const compSize = 4; // bytes per float
  const numComp = acc.type === 'VEC3' ? 3 : acc.type === 'VEC2' ? 2 : 1;
  const effectiveStride = stride || (numComp * compSize);
  
  for (let i = 0; i < count; i++) {
    const byteOff = offset + i * effectiveStride;
    const v = [];
    for (let c = 0; c < numComp; c++) {
      v.push(binData.readFloatLE(byteOff + c * compSize));
    }
    result.push(v);
  }
  return result;
}

// Prim 13 (mat25) is the monitor area - let's get all its vertices
const prim13 = gltf.meshes[0].primitives[13];
const positions = readAccessor(prim13.attributes.POSITION);

console.log(`Prim 13 (mat25) - ${positions.length} vertices:\n`);

// Group by Z to find the screen face
const zValues = {};
positions.forEach(p => {
  const z = p[2].toFixed(4);
  if (!zValues[z]) zValues[z] = [];
  zValues[z].push(p);
});

console.log('Vertices grouped by Z:');
Object.keys(zValues).sort().forEach(z => {
  const verts = zValues[z];
  const xs = verts.map(v => v[0]);
  const ys = verts.map(v => v[1]);
  console.log(`  Z=${z}: ${verts.length} verts, X=[${Math.min(...xs).toFixed(5)}, ${Math.max(...xs).toFixed(5)}], Y=[${Math.min(...ys).toFixed(5)}, ${Math.max(...ys).toFixed(5)}]`);
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  console.log(`    Size: ${w.toFixed(5)} x ${h.toFixed(5)}, Center: (${cx.toFixed(5)}, ${cy.toFixed(5)})`);
});

// Also check Prim 10 (mat24) which could be the monitor body
console.log('\n--- Prim 10 (mat24) ---');
const prim10 = gltf.meshes[0].primitives[10];
const pos10 = readAccessor(prim10.attributes.POSITION);
const zValues10 = {};
pos10.forEach(p => {
  const z = p[2].toFixed(4);
  if (!zValues10[z]) zValues10[z] = [];
  zValues10[z].push(p);
});

Object.keys(zValues10).sort().forEach(z => {
  const verts = zValues10[z];
  const xs = verts.map(v => v[0]);
  const ys = verts.map(v => v[1]);
  console.log(`  Z=${z}: ${verts.length} verts, X=[${Math.min(...xs).toFixed(5)}, ${Math.max(...xs).toFixed(5)}], Y=[${Math.min(...ys).toFixed(5)}, ${Math.max(...ys).toFixed(5)}]`);
  const w = Math.max(...xs) - Math.min(...xs);
  const h = Math.max(...ys) - Math.min(...ys);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  console.log(`    Size: ${w.toFixed(5)} x ${h.toFixed(5)}, Center: (${cx.toFixed(5)}, ${cy.toFixed(5)})`);
});

// Also look at Prim 12 (mat12) - could be the bezel frame
console.log('\n--- Prim 12 (mat12) ---');
const prim12 = gltf.meshes[0].primitives[12];
const pos12 = readAccessor(prim12.attributes.POSITION);

// Filter to just verts near the monitor area (X around 0.3-1.3, Y around 0.1-0.6)
const monitorVerts12 = pos12.filter(p => p[0] > 0.2 && p[0] < 1.4 && p[1] > 0.05 && p[1] < 0.7);
if (monitorVerts12.length > 0) {
  const zv = {};
  monitorVerts12.forEach(p => {
    const z = p[2].toFixed(4);
    if (!zv[z]) zv[z] = [];
    zv[z].push(p);
  });
  Object.keys(zv).sort().forEach(z => {
    const verts = zv[z];
    const xs = verts.map(v => v[0]);
    const ys = verts.map(v => v[1]);
    console.log(`  Z=${z}: ${verts.length} verts, X=[${Math.min(...xs).toFixed(5)}, ${Math.max(...xs).toFixed(5)}], Y=[${Math.min(...ys).toFixed(5)}, ${Math.max(...ys).toFixed(5)}]`);
  });
}
