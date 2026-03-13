const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000814);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 10);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x00ff99, 1);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const stars = new THREE.Group();
for(let i=0;i<500;i++){
    const geometry = new THREE.SphereGeometry(Math.random()*0.03 + 0.01, 6, 6);
    const material = new THREE.MeshBasicMaterial({color:0xffffff});
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
        (Math.random()-0.5)*50,
        (Math.random()-0.2)*20 + 5,
        (Math.random()-0.5)*50
    );
    stars.add(star);
}
scene.add(stars);

const city = new THREE.Group();
for(let i=-15;i<15;i++){
    const height = Math.random()*8 + 2;
    const geometry = new THREE.BoxGeometry(1, height, 1);
    const material = new THREE.MeshStandardMaterial({color:0x081f44, metalness:0.3, roughness:0.7});
    const building = new THREE.Mesh(geometry, material);
    building.position.set(i*2, height/2, -10);
    city.add(building);
}
scene.add(city);

const hackerGeometry = new THREE.BoxGeometry(1,2,0.5);
const hackerMaterial = new THREE.MeshStandardMaterial({color:0x020617});
const hacker = new THREE.Mesh(hackerGeometry, hackerMaterial);
hacker.position.set(0,1,0);
scene.add(hacker);

const computerGeometry = new THREE.BoxGeometry(1.5,1,0.5);
const computerMaterial = new THREE.MeshStandardMaterial({color:0x051c14, emissive:0x00ff99, emissiveIntensity:0.7});
const computer = new THREE.Mesh(computerGeometry, computerMaterial);
computer.position.set(0,0.5,-2);
scene.add(computer);

const screenGeometry = new THREE.PlaneGeometry(1.4,0.9);
const screenMaterial = new THREE.MeshBasicMaterial({color:0x00ff99});
const screen = new THREE.Mesh(screenGeometry, screenMaterial);
screen.position.set(0,0.5,-1.75);
scene.add(screen);

let typingText = "> Access Granted...";
let displayText = "";
let charIndex = 0;
setInterval(()=>{
    displayText += typingText[charIndex];
    charIndex++;
    if(charIndex >= typingText.length){
        displayText = "";
        charIndex = 0;
    }
    screenMaterial.color.set(0x00ff99);
}, 150);

function animate(){
    requestAnimationFrame(animate);
    stars.rotation.y += 0.001;
    city.rotation.y += 0.001;
    computer.rotation.y = Math.sin(Date.now()*0.002)*0.05;
    hacker.rotation.y = Math.sin(Date.now()*0.0015)*0.02;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
