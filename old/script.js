//Three.js libary
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
//Orbit Contol module
//import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
//First-Person Contol module
import { PointerLockControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/PointerLockControls.js';
//import .gltf files
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';
//import Stats from 'https://unpkg.com/three@0.126.1/addons/libs/stats.module.js'
//import DAT.GUI
import { GUI } from 'https://unpkg.com/three@0.164.1/examples/jsm/libs/lil-gui.module.min.js';


//creating the structuere
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
const renderer = new THREE.WebGLRenderer({antialias:true})
//const controls = new OrbitControls(camera, renderer.domElement);
const controls = new PointerLockControls( camera, document.body );
const blocker = document.getElementById( 'blocker' );
const instructions = document.getElementById( 'instructions' );
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const gui = new GUI({ width: 250 });

renderer.setSize(window.innerWidth, window.innerHeight)  //make it take up the full screen
renderer.setPixelRatio(devicePixelRatio)  //fix sharp edges
document.body.appendChild(renderer.domElement)  //append to HTML <body>

//const stats = new Stats()
//document.body.appendChild(stats.dom)

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//Hemisphere Light
const hemisphere = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.75);
scene.add(hemisphere);
//Ambient Light
const ambient = new THREE.AmbientLight( 0x404040 );
scene.add(ambient);
//light1
const light1 = new THREE.DirectionalLight(0xFFFFFF, 0.75)
light1.position.set(0, 5, 0)
light1.rotation.set(0, 0, 0)
//scene.add(light1)

//skybox
const skyboxgeometry = new THREE.BoxGeometry(10000, 10000, 10000);
const skyboxmaterials = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('docs/assets/skybox/1.png'), side: THREE.DoubleSide}),  //right of camera
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('docs/assets/skybox/2.png'), side: THREE.DoubleSide}),  //left of camera
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('docs/assets/skybox/3.png'), side: THREE.DoubleSide}),  //top of camera
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('docs/assets/skybox/4.png'), side: THREE.DoubleSide}),  //bottom of camera
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('docs/assets/skybox/5.png'), side: THREE.DoubleSide}),  //back of camera
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('docs/assets/skybox/6.png'), side: THREE.DoubleSide})  //front of camera
];
const skyboxmaterial = new THREE.MeshFaceMaterial(skyboxmaterials);
const skybox = new THREE.Mesh(skyboxgeometry, skyboxmaterial);
skybox.position.set(0, 0, 0);
skybox.rotation.set(Math.random() * 1, Math.random() * 1, Math.random() * 1);
scene.add(skybox)

//model
const gltfLoader = new GLTFLoader();
gltfLoader.setPath('./docs/assets/model/Room/');
gltfLoader.load('Room.gltf', (gltfScene) => {
    //
    //gltfScene.scene.position.set(-1.75, 0.5, -1.75)
    gltfScene.scene.rotation.set(0, -Math.PI /2 , 0)
    //gltfScene.scene.scale.set(0.02, 0.02, 0.02)
    //
    scene.add(gltfScene.scene);
});
//plane
const planegeometry = new THREE.PlaneGeometry(5, 5);
const planematerial = new THREE.MeshPhongMaterial( {color: 0xe3cad3, side: THREE.DoubleSide} );
const plane = new THREE.Mesh(planegeometry, planematerial);
plane.position.set(0, 0, 0);
plane.rotation.set(270 * (Math.PI / 180), 0, 0);
//scene.add(plane)  
//sphere
const sphereGeometry = new THREE.SphereGeometry(1, 10, 10)
//const spherematerial = new THREE.MeshPhongMaterial({color: 0xcffffb})
const spherematerial = new THREE.MeshPhongMaterial({color: 0xFF0000})
const sphere = new THREE.Mesh(sphereGeometry, spherematerial)
sphere.position.set(0, 2, 0);
sphere.rotation.set(0, 0, 0);
//sphere.material.wireframe = true;
//sphere.material.color.setHex(0xFF0000);
scene.add(sphere)

//scene.add( new THREE.AxesHelper( 1 ) ); //(x, y ,z)=(red, green, blue)

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//camera
const camerafolder = gui.addFolder('camera');
camerafolder.add(camera.position, "x", -10, 10, 1).name("sphereX");
camerafolder.add(camera.position, "y", -10, 10, 1).name("sphereY");
camerafolder.add(camera.position, "z", -10, 10, 1).name("sphereZ");
camerafolder.add(camera.rotation, "x", -Math.PI, Math.PI, Math.PI/180).name("X Rotation");
camerafolder.add(camera.rotation, "y", -Math.PI, Math.PI, Math.PI/180).name("Y Rotation");
camerafolder.add(camera.rotation, "z", -Math.PI, Math.PI, Math.PI/180).name("Z Rotation");

//skybox
const skyboxfolder = gui.addFolder('Skybox');
skyboxfolder.add(skybox.position, "x", -10, 10, 1).name("sphereX");
skyboxfolder.add(skybox.position, "y", -10, 10, 1).name("sphereY");
skyboxfolder.add(skybox.position, "z", -10, 10, 1).name("sphereZ");
skyboxfolder.add(skybox, "visible").name("visibility");

//sphere
const spherefolder = gui.addFolder('Sphere');
spherefolder.add(sphere.position, "x", -10, 10, 1).name("sphereX");
spherefolder.add(sphere.position, "y", -10, 10, 1).name("sphereY");
spherefolder.add(sphere.position, "z", -10, 10, 1).name("sphereZ");
spherefolder.add(sphere.scale, "x", 0, 2, 0.1).name("scaleX");
spherefolder.add(sphere.scale, "y", 0, 2, 0.1).name("scaleY");
spherefolder.add(sphere.scale, "z", 0, 2, 0.1).name("scaleZ");
spherefolder.add(sphere, "visible").name("visibility");
spherefolder.add(spherematerial, "wireframe");
const colorFormats = {
    string: "#FFFFFF",
    int: 0xFFFFFF,
    object: { r: 1, g: 1, b: 1},
    array: [1, 1, 1]
}
spherefolder.add(colorFormats, "string").onChange(() => {
    spherematerial.color.set(colorFormats.string);
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

//highlight
let intersects = [];
let firstobject;
let colour;
const onMouseMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    raycaster.near = 0.1; // Minimum distance
    raycaster.far = 100;  // Maximum distance
    intersects = raycaster.intersectObjects(scene.children);
    console.log(intersects);

    if (intersects[0] != firstobject) {
        if (firstobject != null) {
        firstobject.object.material.color.set(colour);
        console.log('unhighlighted');
        }

        firstobject = intersects[0]
        colour = firstobject.object.material.color.getHex();
        firstobject.object.material.color.set(0xFFFFFF);
        console.log('highlighted');
    }
}
//
window.addEventListener('mousemove', onMouseMove)

//click
const onMouseClick = (event) => {
    console.log('click');
    //console.log(intersects);

    if (intersects.length > 0) {
        intersects[0].object.material.color.set(Math.random() * 0xFF0000);
    }
}
//
window.addEventListener('click', onMouseClick)

//window resize
window.addEventListener( 'resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
});


document.addEventListener('click', function () {
    if (cameraset3){
        controls.lock();
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


let cameraset1 = false;
let cameraset2 = false;
let cameraset3 = false;
controls.activeLook = false;

function animate() {  //animation loop
    renderer.render(scene, camera)

    if(!cameraset1){
        //camera
        camera.position.set(0, 10, 0)
        camera.rotation.set(Math.PI/2, 0, 0)
        //camera.lookAt(0, 0, 0);
        //controls.update();
        
        //camera.rotation.x += Math.PI
        //camera.rotation.x += Math.PI

        cameraset1 = true
    }

    skybox.rotation.x += 0.0003 
    skybox.rotation.y += 0.0003 
    skybox.rotation.z += 0.0003 

    if ((animation1 == true) && (!cameraset2)) {
        controls.activeLook = false;

        if (camera.position.y > 0) {
            camera.position.y += -0.12
        }else{
            cameraset2 = true;
        }
        if ((camera.rotation.x > 0) && (!cameraset3)) {
            camera.rotation.x += -0.02
        }else{
            cameraset3 = true;
            controls.activeLook = true;
        }

        sphere.rotation.x += 0.01 
        sphere.rotation.y += 0.01 
        sphere.rotation.z += 0.01 
    }
  
    requestAnimationFrame(animate)
}

animate()