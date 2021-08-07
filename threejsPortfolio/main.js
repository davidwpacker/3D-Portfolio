import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' // allows for more interactivity. Move around the scene with the mouse. 

const scene = new THREE.Scene(); // scene == container 
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ); // human perspective. First input: field of view (human sight), 2nd argument: aspect ratio (user's browser window), last two arguments are the 'view frustum' to control which objects are visible relative to the camera itself) 


const renderer = new THREE.WebGL1Renderer( //make the magic happen!
  {
    canvas: document.querySelector('#bg')// renderer needs to know what DOM element to choose
  }
); 

renderer.setPixelRatio( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);// FULL screen canvas 

camera.position.setZ(30) // by default it's in the middle of the scene so we can change it to be on the Z axis which will give a better perspective for looking at shapes
renderer.render(scene, camera); 



/* OBJECTS */
// step 1: Geometry
const geometry = new THREE.TorusGeometry(10,3,16,100); // the x,y,z that makeup a shape. Reference 3js documentation to see built-in geomtries eg OctahedronGeometry
// step 2: Material (wrapping paper for an object)
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347} );  //webGL has custom shaders (use bruno simon's tut for that if needed.) Most materials need a light source to bounce off of them. Wireframe allows us to get a better look at the geometry. Change from MeshBasicMaterial to MeshStandardMaterial & remove wireframe prop for lighting. 
// step 3: MESH! = geometry + material
const torus = new THREE.Mesh( geometry, material);

scene.add(torus); // adding to the scene 


const pointLight = new THREE.PointLight(0xffffff); // 0x is a hexidecimal literal/value which just lets the OS know that youre not using random values & colour is white // this is essentiall a lightbulb which will show our object. Without this, the room is dark. Since we removed MeshBasicMaterial & wireframe: true
pointLight.position.set(5,5,5); // positioned inside the torus so it's lit up. values: 20,20,20 pushes it further out so u see the full object view 

const ambientLight = new THREE.AmbientLight(0xffffff); // lights up across the entire scene
scene.add(pointLight, ambientLight); // add to scen just like any other object 

const lightHelper = new THREE.PointLightHelper(pointLight); //shows position of point light (the doublesided square pyramid). 
const gridHelper = new THREE.GridHelper(200,50); // Draws a 2D grid across the screen (our view is completely lvl with the grid here, hence why we see only a horizontal line)
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement); //thtis will listen to DOM events on the mouse and update camera position accordingly


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24); // 0.25 radius of each object. 
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff} )
  const star = new THREE.Mesh( geometry, material);

  const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread(100) )       // each object to be randomly generated in different positions. randfloatsprad generates a random number from -100 to 100. 

  star.position.set(x,y,z);
}



renderer.render( scene, camera ); // to actually SEE it we need to call this render method... again. BUT using a function w/ animate is easier 


function animate() { // recursive function that gives us an infinite loop which calls the render method automatically 
  requestAnimationFrame( animate );

  torus.rotation.x += 0.025; // rotation along the x-axis is increased every frame by whatever value we choose. 
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.001;

  controls.update(); // makes sures changes are updated in the UI


  renderer.render( scene, camera ); // aka game loop
}
animate();