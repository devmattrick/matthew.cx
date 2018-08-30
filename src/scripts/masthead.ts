import * as THREE from 'three';

const canvas = <HTMLCanvasElement> document.getElementById('mastheadBackground');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 300);
camera.lookAt(0, 0, 0);
const material = new THREE.MeshPhongMaterial({
  color: 0xD7184C
});
material.flatShading = true;

const geometry = new THREE.SphereGeometry(
  55,
  20,
  10
);

const vertex = [];

geometry.vertices.forEach(v => {
  vertex.push({
    speed: Math.random() * 0.05,
    direction: Math.random() > 0.5
  });

  const spherical = new THREE.Spherical().setFromVector3(v);
  spherical.radius = (Math.random() * 10) - 5;
  v.add(new THREE.Vector3().setFromSpherical(spherical));
});

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0x161541);

const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(100, 0, 0);
mesh.receiveShadow = true;
scene.add(mesh);

const light = new THREE.PointLight(0xFE4E4E, 1);
light.position.set(100, 100, 200);
light.castShadow = true;
scene.add(light);

scene.add(new THREE.AmbientLight(0x161541, 3));

const starsGeometry = new THREE.Geometry();

for (let i = 0; i < 10000; i++) {

  const star = new THREE.Vector3();
  star.x = THREE.Math.randFloatSpread(2000);
  star.y = THREE.Math.randFloatSpread(2000);
  star.z = THREE.Math.randFloat(-2000, -100)

  starsGeometry.vertices.push(star);

}

const starsMaterial = new THREE.PointsMaterial({ color: 0xDDDDDD });

const starField = new THREE.Points(starsGeometry, starsMaterial);

scene.add(starField);

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

function draw() {
  requestAnimationFrame(draw);

  light.updateMatrix();
  light.updateMatrixWorld(false);

  geometry.vertices.forEach((v, index) => {
    const spherical = new THREE.Spherical().setFromVector3(v);

    if (spherical.radius > 60) {
      vertex[index].direction = true;
    }

    if (spherical.radius < 50) {
      vertex[index].direction = false;
    }

    if (vertex[index].direction) {
      spherical.radius = -vertex[index].speed;
    }
    else {
      spherical.radius = vertex[index].speed;
    }

    v.add(new THREE.Vector3().setFromSpherical(spherical));
  });

  geometry.rotateY(0.001);

  geometry.verticesNeedUpdate = true;
  geometry.computeFlatVertexNormals();
  renderer.render(scene, camera);
}

resize();
window.addEventListener('resize', resize);

draw();
