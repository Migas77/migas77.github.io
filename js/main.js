import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import cannonEsDebugger from 'https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm'
import { MapControls } from 'three/addons/controls/MapControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

import { sceneElements, getPhysicsWorldId } from "./sceneElements.js";
import { loadFence } from "./models/fence.js";
import { loadGround } from "./models/ground.js";
import { loadBall } from "./models/ball.js";
import { loadCar } from "./models/car.js";
import { loadNameText } from "./models/3dletters.js";

var debugcannon;

// loaders
const gltfLoader = new GLTFLoader();
const fontLoader = new FontLoader();
// Camera Positions
const [cameraOffsetX, cameraOffsetY, cameraOffsetZ] = [8, 6, 8]



// HELPER FUNCTIONS

const helper = {

    initEmptyScene: function (sceneElements) {

        // ************************** //
        // Create the 3D scene
        // ************************** //
        sceneElements.sceneGraph = new THREE.Scene();

        // ************************** //
        // Add camera
        // ************************** //
        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(cameraOffsetX, cameraOffsetY, cameraOffsetZ);
        camera.lookAt(0, 0, 0);

        // ************************** //
        // Illumination
        // ************************** //

        // ************************** //
        // Add ambient light
        // ************************** //
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)');
        sceneElements.sceneGraph.add(ambientLight);

        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        const spotLight1 = new THREE.SpotLight('rgb(255, 255, 255)', 40);
        spotLight1.decay = 1;
        spotLight1.position.set(-5, 8, 0);
        sceneElements.sceneGraph.add(spotLight1);

        // Setup shadow properties for the spotlight
        spotLight1.castShadow = true;
        spotLight1.shadow.mapSize.width = 2048;
        spotLight1.shadow.mapSize.height = 2048;
        spotLight1.name = "light 1";

        // *********************************** //
        // Create renderer (with shadow map)
        // *********************************** //
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(255, 255, 150)', 1.0);
        renderer.setSize(width, height);

        // Setup shadowMap property
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // **************************************** //
        // Add the rendered image in the HTML DOM
        // **************************************** //
        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);

        // ************************** //
        // Control for the camera
        // ************************** //
        const controls = new MapControls( camera, renderer.domElement );
        sceneElements.controls = controls
        // how far can you dolly in and out
        // controls.minDistance = 10.0
        // controls.maxDistance = 20.0
        // Disable rotating
        // controls.enableRotate = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.panSpeed = 2

        // ************************** //
        // Create raycaster and pointer
        // ************************** //
        sceneElements.raycaster = new THREE.Raycaster();
        sceneElements.pointer = new THREE.Vector2();

        // ************************** //
        // Create physics world
        // ************************** //
        sceneElements.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
        })

        debugcannon = new cannonEsDebugger(sceneElements.sceneGraph, sceneElements.world);
    },

    render: function (sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
    },
};

// FUCNTIONS FOR BUILDING THE SCENE
const scene = {

    // Create and insert in the scene graph the models of the 3D scene

    load3DObjects: function (sceneGraph) {

        // ************************** //
        // Coordinate Axis
        // ************************** //
        const axes = new THREE.AxesHelper(15);
        sceneGraph.add(axes);

        // ************************** //
        // Create a cube
        // ************************** //
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,0,0)' });
        const cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
        sceneGraph.add(cubeObject);
        // Cube center is at (0,0,0)
        // Set position of the cube
        // The base of the cube will be on the plane
        cubeObject.translateY(10);
        // Set shadow property
        cubeObject.castShadow = true;
        cubeObject.receiveShadow = true;
        cubeObject.name = "cube";

        // ************************** //
        // Create the Car Model
        // ************************** //
        loadGround();
        loadFence();
        loadBall(gltfLoader);
        loadCar(gltfLoader);
        loadNameText(fontLoader);

        // ************************** //
        // Create an empty rectangle
        // ************************** //
        const empty_rectangle = new THREE.Group()
        const points = [
            new THREE.Vector3( -1, 0, 1),
            new THREE.Vector3( 1, 0, 1),
            new THREE.Vector3( 1, 0, -1),
            new THREE.Vector3( -1, 0, -1),
            new THREE.Vector3( -1, 0, 1,)
        ];
        const material = new THREE.LineBasicMaterial( {
            color: 0x0000ff ,
            linewidth: 10,    // Line thickness
            opacity: 0.5,    // Line opacity
            transparent: true // Enable transparency
        } );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( geometry, material );
        empty_rectangle.add(line);
        line.name = "empty_rectangle"
        empty_rectangle.name = "empty_rectangle"
        sceneElements.sceneGraph.add(line)
    }
};

// ************************** //
// ANIMATION:
// Displacement Values
var dispX = 0.2, dispZ = 0.2;
// To keep Track of the keyboard
var keyArrowLeft = false, keyArrowUp = false, keyArrowRight = false, keyArrowDown = false;
var keyEnter = false;
// To keep track and move car
var trackingVehicle = true;
var isCarBeingMoved = false;
const maxSteerVal = 0.5
const maxForce = 100
const accelaratingForce = 10
const brakeForce = 1000000
// ************************** //
function computeFrame(time) {
    const empty_rectangle = sceneElements.sceneGraph.getObjectByName("empty_rectangle");


    sceneElements.raycaster.setFromCamera( sceneElements.pointer, sceneElements.camera);
    const cube = sceneElements.sceneGraph.getObjectByName("cube");

    sceneElements.raycaster.set(cube.position, new THREE.Vector3(0, 1, 0));
    const intersects2 = sceneElements.raycaster.intersectObject( empty_rectangle );
    if (intersects2.length > 0){
        // console.log("cube intersecting empty_rectangle")
        if (keyEnter){
            // console.log("key enter pressed")
            // empty_rectangle.children[0].material.color.setHex( 0x0000ff );
        }
    } else {
        // empty_rectangle.children[0].material.color.setHex( 0x000000 );
    }

    handleCarMovement()



    if (debugcannon != undefined){
        debugcannon.update()
    }
    sceneElements.controls.update(); // required if controls.enableDamping is set to true
    // Rendering
    helper.render(sceneElements);
    // Animation
    // Call for the next frame
    requestAnimationFrame(computeFrame);

    // Run the simulation
    sceneElements.world.fixedStep()
}

// ************************** //
// HANDLE CAR MOVEMENT
// ************************** //
function handleCarMovement() {

    if (keyEnter) {
        console.log(sceneElements.vehicle.wheelInfos[3])
    }

    if (keyArrowUp) {
        sceneElements.vehicle.applyEngineForce(-maxForce, 2)
        sceneElements.vehicle.applyEngineForce(-maxForce, 3)
    }
    if (keyArrowDown) {
        sceneElements.vehicle.applyEngineForce(maxForce, 2)
        sceneElements.vehicle.applyEngineForce(maxForce, 3)
    }

    if (!keyArrowUp && !keyArrowDown){
    }

    if (keyArrowLeft) {
        sceneElements.vehicle.setSteeringValue(maxSteerVal, 0)
        sceneElements.vehicle.setSteeringValue(maxSteerVal, 1)
    }

    if (keyArrowRight){
        sceneElements.vehicle.setSteeringValue(-maxSteerVal, 0)
        sceneElements.vehicle.setSteeringValue(-maxSteerVal, 1)
    }

    if (isCarBeingMoved == true){

    }

    if (trackingVehicle == true){
        const camera_position = sceneElements.camera.position
        const vehicle_position_cannon = sceneElements.vehicle.chassisBody.position
        const vehicle_position = new THREE.Vector3(vehicle_position_cannon.x, vehicle_position_cannon.y, vehicle_position_cannon.z)
        camera_position.copy(vehicle_position).add(new THREE.Vector3(cameraOffsetX, cameraOffsetY, cameraOffsetZ));
        sceneElements.controls.target = vehicle_position
    }
}

// ************************** //
// HANDLING EVENTS
//   1. Resize Window
//   2. User interaction with keyboard
//   3. User interaction with mouse
// ************************** //
window.addEventListener('resize', resizeWindow);
// Update render image (size) and camera aspect when the window is resized
function resizeWindow(eventParam) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    sceneElements.camera.aspect = width / height;
    sceneElements.camera.updateProjectionMatrix();

    sceneElements.renderer.setSize(width, height);

    // Comment when doing animation
    // computeFrame(sceneElements);
}



document.addEventListener('keydown', function onDocumentKeyDown(event) {
    // 0 -> right front wheel
    // 1 -> left front wheel
    // 2 -> right back wheel
    // 3 -> left back wheel
    switch (event.key) {
        case 'Enter':
            keyEnter = true;
            break;
        case 'w':
        case 'ArrowUp':
            keyArrowUp = true;
            trackingVehicle = true;
            isCarBeingMoved = true;
            break;
        case 's':
        case 'ArrowDown':
            keyArrowDown = true;
            isCarBeingMoved = true;
            trackingVehicle = true;
            break;
        case 'a':
        case 'ArrowLeft':
            keyArrowLeft = true;
            trackingVehicle = true;
            break;
        case 'd':
        case 'ArrowRight':
            keyArrowRight = true;
            trackingVehicle = true;
            break;
    }
}, false);

document.addEventListener('keyup', function onDocumentKeyUp(event) {
    switch (event.key) {
        case 'Enter':
            keyEnter = false;
            break;
        case 'w':
        case 'ArrowUp':
            keyArrowUp = false;
            sceneElements.vehicle.applyEngineForce(0, 2)
            sceneElements.vehicle.applyEngineForce(0, 3)
            break;
        case 's':
        case 'ArrowDown':
            keyArrowDown = false;
            sceneElements.vehicle.applyEngineForce(0, 2)
            sceneElements.vehicle.applyEngineForce(0, 3)
            break;
        case 'a':
        case 'ArrowLeft':
            keyArrowLeft = false;
            sceneElements.vehicle.setSteeringValue(0, 0)
            sceneElements.vehicle.setSteeringValue(0, 1)
            break;
        case 'd':
        case 'ArrowRight':
            sceneElements.vehicle.setSteeringValue(0, 0)
            sceneElements.vehicle.setSteeringValue(0, 1)
            keyArrowRight = false;
            break;
    }
}, false);

document.addEventListener("mousedown", function onDocumentClick(event){
    // Dragging/moving the camera -> stop tracking the vehicle
    trackingVehicle = false
});

document.addEventListener( 'pointermove', function onPointerMove( event ) {
    sceneElements.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    sceneElements.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});

// ************************** //
// INITIALIZATION
//  1. Initialize the empty scene
//  2. Add elements within the scene
//  3. Animate
// ************************** //
function init() {
    helper.initEmptyScene(sceneElements);
    scene.load3DObjects(sceneElements.sceneGraph);
    requestAnimationFrame(computeFrame);
}

// ************************** //
// STARTING
// ************************** //
init();