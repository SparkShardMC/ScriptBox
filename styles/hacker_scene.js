const scene=new THREE.Scene();
scene.background=new THREE.Color(0x000814);
const camera=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,3,10);
camera.lookAt(0,1,0);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled=true;
document.body.appendChild(renderer.domElement);

const ambient=new THREE.AmbientLight(0xffffff,0.5);
scene.add(ambient);
const point=new THREE.PointLight(0x00ff99,2,50);
point.position.set(0,5,5);
scene.add(point);
const neon=new THREE.PointLight(0xff00ff,1.5,30);
neon.position.set(-5,5,-5);
scene.add(neon);

const starGeo=new THREE.BufferGeometry();
const starCount=500;
const positions=[];
for(let i=0;i<starCount;i++){positions.push((Math.random()-0.5)*50,Math.random()*20+2,(Math.random()-0.5)*50);}
starGeo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
const stars=new THREE.Points(starGeo,new THREE.PointsMaterial({color:0xffffff,size:0.1}));
scene.add(stars);

const city=new THREE.Group();
for(let i=-10;i<=10;i++){
  const h=Math.random()*5+3;
  const b=new THREE.Mesh(new THREE.BoxGeometry(1,h,1),new THREE.MeshStandardMaterial({color:0x081f44,emissive:0x00ff99,emissiveIntensity:0.6,metalness:0.5,roughness:0.2}));
  b.position.set(i*2,h/2,-5);
  city.add(b);
}
scene.add(city);

const hacker=new THREE.Group();
const body=new THREE.Mesh(new THREE.CapsuleGeometry(0.5,1.2,4,8),new THREE.MeshStandardMaterial({color:0x020617}));
body.position.set(0,1,0);
hacker.add(body);
const head=new THREE.Mesh(new THREE.SphereGeometry(0.35,16,16),new THREE.MeshStandardMaterial({color:0x020617}));
head.position.set(0,2.05,0);
hacker.add(head);
const leftEye=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.05,0.05),new THREE.MeshStandardMaterial({color:0x00ff99,emissive:0x00ff99}));
leftEye.position.set(-0.12,2.05,0.33);
const rightEye=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.05,0.05),new THREE.MeshStandardMaterial({color:0x00ff99,emissive:0x00ff99}));
rightEye.position.set(0.12,2.05,0.33);
hacker.add(leftEye);
hacker.add(rightEye);
const laptopBase=new THREE.Mesh(new THREE.BoxGeometry(0.8,0.05,0.5),new THREE.MeshStandardMaterial({color:0x051c14,emissive:0x00ff99,emissiveIntensity:0.8}));
laptopBase.position.set(0,0.9,-0.5);
hacker.add(laptopBase);
const laptopScreen=new THREE.Mesh(new THREE.PlaneGeometry(0.8,0.5),new THREE.MeshBasicMaterial({color:0x00ff99}));
laptopScreen.position.set(0,1.15,-0.75);
laptopScreen.rotation.x=-0.3;
hacker.add(laptopScreen);
scene.add(hacker);

function animate(){
  requestAnimationFrame(animate);
  stars.rotation.y+=0.0005;
  city.rotation.y+=0.0005;
  hacker.rotation.y=Math.sin(Date.now()*0.001)*0.05;
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);
});
