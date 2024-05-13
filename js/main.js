import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import cannonEsDebugger from 'https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm'
import { MapControls } from 'three/addons/controls/MapControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { sceneElements, getPhysicsWorldId } from "./sceneElements.js";
import { loadFence } from "./models/fence.js";
import { loadGround } from "./models/ground.js";
import { loadBall } from "./models/ball.js";
import { loadCar } from "./models/car.js";
import { loadNameText } from "./models/3dletters.js";
import {intersectCarAndButtons, loadButton} from "./models/button.js";
import { loadLightPole } from "./models/lightpole.js";
import { loadRoadSign } from "./models/road_sign.js";
import { loadPainting } from "./models/paiting.js";
import { loadStatue } from "./models/statue.js";
import {loadImage} from "./models/myImageLoader.js";
import {loadTile} from "./models/tile.js";

var debugcannon;

// loaders

const gltfLoader = new GLTFLoader();
const fontLoader = new FontLoader();
// Camera Positions
const [cameraOffsetX, cameraOffsetY, cameraOffsetZ] = [8, 6.7, 8]



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
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.2);
        sceneElements.sceneGraph.add(ambientLight);

        const dirLight = new THREE.DirectionalLight( 'rgb(255, 255, 255)', 2);
        dirLight.position.set(0, 10, 0)
        dirLight.castShadow = true
        dirLight.decay = 1
        dirLight.shadow.mapSize.width = 2048
        dirLight.shadow.mapSize.height = 2048
        dirLight.name = "directional_light"
        // sceneElements.sceneGraph.add(dirLight)


        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        const spotLight1 = new THREE.SpotLight('rgb(255, 255, 255)', 40);
        spotLight1.decay = 1;
        spotLight1.position.set(0, 8, 5);
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


        // **************************************** //
        // Add label rendered
        // **************************************** //
        sceneElements.labelRenderer = new CSS2DRenderer()
        sceneElements.labelRenderer.setSize( window.innerWidth, window.innerHeight );
        sceneElements.labelRenderer.domElement.style.position = 'absolute';
        sceneElements.labelRenderer.domElement.style.top = '0px';
        document.body.appendChild( sceneElements.labelRenderer.domElement );


        // ************************** //
        // Control for the camera
        // ************************** //
        const controls = new MapControls( camera, sceneElements.labelRenderer.domElement );
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
        sceneElements.labelRenderer.render(sceneElements.sceneGraph, sceneElements.camera)
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
        // Load Models
        // ************************** //
        loadGround(); // HAS TO BE THE FIRST ONE
        loadFence();
        loadCar(gltfLoader, {x: 0, y: 2, z: -13.5});
        loadBall(gltfLoader);
        loadTile(0.5, {x: -0.4, z: -12})
        loadTile(0.5, {x: 0.2, z: -11})
        loadTile(0.5, {x: -0.2, z: -10})
        loadTile(0.5, {x: 0.4, z: -9})
        loadNameText(fontLoader, {x: -5.5, z: -8});
        loadTile(0.5, {x: -0.1, z: -7})
        loadTile(0.5, {x: 0.2, z: -6.2})
        loadTile(0.5, {x: 0, z: -5})
        loadTile(0.5, {x: -0.3, z: -4.2})
        loadTile(0.5, {x: 0.4, z: -3.3})
        loadTile(0.5, {x: 0.1, z: -2.5})
        loadTile(0.5, {x: -0.3, z: -1.8})
        loadTile(0.5, {x: 0, z: -1})
        loadStatue(
            gltfLoader,
            "glb/heavy_infantry_mandalorian_funko_pop.glb",
            {x: 0, z: 2},
            {x: 0.12, y:-0.22, z:0},
            -0.6
        )
        loadStatue(
            gltfLoader,
            "glb/heavy_infantry_mandalorian_funko_pop.glb",
            {x: 5.5, z: 7.5},
            {x: 0.12, y:-0.22, z:0},
            -0.6
        )
        loadStatue(
            gltfLoader,
            "glb/heavy_infantry_mandalorian_funko_pop.glb",
            {x: -5.5, z: -3.5},
            {x: 0.12, y:-0.22, z:0},
            -0.6
        )
        loadStatue(
            gltfLoader,
            "glb/heavy_infantry_mandalorian_funko_pop.glb",
            {x: 5.5, z: -3.5},
            {x: 0.12, y:-0.22, z:0},
            -0.6
        )
        loadStatue(
            gltfLoader,
            "glb/heavy_infantry_mandalorian_funko_pop.glb",
            {x: -5.5, z: 7.5},
            {x: 0.12, y:-0.22, z:0},
            -0.6
        )
        loadRoadSign(fontLoader, "PROJECTS", 5.5, 2, 0, 0.06, true)
        loadRoadSign(fontLoader, "PLAYGROUND", -5.5, 2, 0, 0.06, false)
        loadRoadSign(fontLoader, "INFORMATION", 0, 7.5, Math.PI/2, 0.06, false)
        // loadLightPole()
        // loadImage("images/GITHUB.png", 5, 5, {x:0, y:0.01, z:0}, -Math.PI/2)
        // loadPainting(gltfLoader, "images/sub19_subida.jpeg", {x: 0, y: 2, z: 0})
        loadButton(2, 2, {x: 8, z: 6}, "Github", "https://github.com/Migas77")


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
var carForward = new CANNON.Vec3()
var carAngle = 0
var oldPosition = new CANNON.Vec3(0, 4, -5)
var carSpeed = 0
var forwardSpeed = 0;
var goingForward = false;
const accelaratingForce = 10
const brakeForce = 1000000
// ************************** //
function computeFrame(time) {

    handleCarMovement()
    intersectCarAndButtons()

    if (debugcannon !== undefined){
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

    if (keyArrowUp) {

        sceneElements.vehicle.applyEngineForce(-maxForce, 2)
        sceneElements.vehicle.applyEngineForce(-maxForce, 3)
    }
    if (keyArrowDown) {

        sceneElements.vehicle.applyEngineForce(maxForce, 2)
        sceneElements.vehicle.applyEngineForce(maxForce, 3)
    }

    let positionDelta = new CANNON.Vec3()
    positionDelta = positionDelta.copy(sceneElements.vehicle.chassisBody.position)
    positionDelta = positionDelta.vsub(oldPosition)

    oldPosition.copy(sceneElements.vehicle.chassisBody.position)
    carSpeed = positionDelta.length()

    const localForward = new CANNON.Vec3(1, 0, 0)
    sceneElements.vehicle.chassisBody.vectorToWorldFrame(localForward, carForward)

    forwardSpeed = carForward.dot(positionDelta)
    goingForward = forwardSpeed > 0

    if (keyArrowLeft) {

        sceneElements.vehicle.setSteeringValue(maxSteerVal, 0)
        sceneElements.vehicle.setSteeringValue(maxSteerVal, 1)
    }

    if (keyArrowRight){

        sceneElements.vehicle.setSteeringValue(-maxSteerVal, 0)
        sceneElements.vehicle.setSteeringValue(-maxSteerVal, 1)
    }

    if (!keyArrowUp && !keyArrowDown){
        // Update speed

        let oppositeForce = carForward.clone()
        if (goingForward)
            oppositeForce = oppositeForce.negate()
        oppositeForce.scale(sceneElements.vehicle.chassisBody.velocity.length() * 0.1)
        sceneElements.vehicle.chassisBody.applyImpulse(oppositeForce, sceneElements.vehicle.chassisBody.position)
    }

    if (isCarBeingMoved === true){

    }

    if (trackingVehicle === true){
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
    sceneElements.labelRenderer.setSize(width, height);

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