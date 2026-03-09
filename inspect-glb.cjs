const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, 'public/models/room.glb');
const buf = fs.readFileSync(glbPath);

// GLB header: magic(4) + version(4) + length(4) + json_chunk_length(4) + json_chunk_type(4) + json_data
const jsonLen = buf.readUInt32LE(12);
const jsonStr = buf.slice(20, 20 + jsonLen).toString('utf8');
const gltf = JSON.parse(jsonStr);

console.log('=== NODES ===');
if (gltf.nodes) {
  gltf.nodes.forEach((n, i) => {
    const hasMesh = n.mesh !== undefined;
    const meshInfo = hasMesh ? ' [mesh:' + n.mesh + ']' : '';
    const childInfo = n.children ? ' children:[' + n.children.join(',') + ']' : '';
    const trans = n.translation ? ' pos:(' + n.translation.map(v => v.toFixed(2)).join(',') + ')' : '';
    const scl = n.scale ? ' scale:(' + n.scale.map(v => v.toFixed(2)).join(',') + ')' : '';
    const rot = n.rotation ? ' rot:(' + n.rotation.map(v => v.toFixed(2)).join(',') + ')' : '';
    console.log(i + ': ' + (n.name || 'unnamed') + meshInfo + trans + scl + rot + childInfo);
  });
}

console.log('\n=== MESHES ===');
if (gltf.meshes) {
  gltf.meshes.forEach((m, i) => {
    console.log(i + ': ' + (m.name || 'unnamed') + ' primitives:' + m.primitives.length);
  });
}

console.log('\n=== MATERIALS ===');
if (gltf.materials) {
  gltf.materials.forEach((m, i) => {
    console.log(i + ': ' + (m.name || 'unnamed'));
  });
}
