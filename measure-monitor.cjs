const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, 'public/models/room.glb');
const buf = fs.readFileSync(glbPath);

// Parse GLB
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonStr);

// Binary chunk starts after JSON chunk
const binChunkStart = 20 + jsonLen;
const binLen = buf.readUInt32LE(binChunkStart);
const binData = buf.slice(binChunkStart + 8, binChunkStart + 8 + binLen);

// The model has a single mesh with 18 primitives. 
// Let's dump bounding boxes for each primitive to find the monitor screen.
const mesh = gltf.meshes[0];

console.log('=== Per-primitive bounding boxes ===\n');
mesh.primitives.forEach((prim, i) => {
  const posAccessorIdx = prim.attributes.POSITION;
  const accessor = gltf.accessors[posAccessorIdx];
  const materialIdx = prim.material;
  const matName = materialIdx !== undefined ? gltf.materials[materialIdx].name : 'none';
  
  const min = accessor.min;
  const max = accessor.max;
  const cx = ((min[0] + max[0]) / 2).toFixed(4);
  const cy = ((min[1] + max[1]) / 2).toFixed(4);
  const cz = ((min[2] + max[2]) / 2).toFixed(4);
  const sx = (max[0] - min[0]).toFixed(4);
  const sy = (max[1] - min[1]).toFixed(4);
  const sz = (max[2] - min[2]).toFixed(4);
  
  console.log(`Prim ${i} [${matName}]:`);
  console.log(`  X: [${min[0].toFixed(5)}, ${max[0].toFixed(5)}]  Y: [${min[1].toFixed(5)}, ${max[1].toFixed(5)}]  Z: [${min[2].toFixed(5)}, ${max[2].toFixed(5)}]`);
  console.log(`  Center: (${cx}, ${cy}, ${cz})  Size: (${sx}, ${sy}, ${sz})`);
  console.log(`  Vertex count: ${accessor.count}`);
  console.log();
});
