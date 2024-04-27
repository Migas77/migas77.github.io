import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import cannonEsDebugger from 'https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm'
import { MapControls } from 'three/addons/controls/MapControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { loadFence } from "./models/fence.js";

var debugcannon;

// loader
const gltfLoader = new GLTFLoader();

// Camera Positions
const [cameraOffsetX, cameraOffsetY, cameraOffsetZ] = [8, 6, 8]

// To store the scene graph, and elements usefull to rendering the scene
export const sceneElements = {
    renderer: null,
    camera: null,
    sceneGraph: null,   // visual world
    world: null,        // physics world
    raycaster: null,
    pointer: null,
    vehicle: null
};

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
        // loadBall();
        loadCar();
        loadNameText();
        loadFence();

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
// HELPER FUNCTIONS
// 1. Load, add to the scene and world the ground model at y = 0
// 1. Load, add to the scene and world the ball model at the position (0,0,0)
// 2. Load, add to the scene and world the Car Model at the position (0, 0, 0) facing the z axis
// 3. visual_world_name = custom_name + physicsWorldId. Function to get the physicsWorldId from visual_world_name
// ************************** //
function loadGround() {
    // Visual Representation
    const planeGeometry = new THREE.PlaneGeometry(48, 48);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(200, 200, 200)', side: THREE.DoubleSide });
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    planeObject.rotation.x = Math.PI/2
    planeObject.receiveShadow = true;
    planeObject.name = "ground_0"
    sceneElements.sceneGraph.add(planeObject);

    // Physic Representation
    const groundMaterial = new CANNON.Material("ground")
    const groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })
    groundBody.addShape(new CANNON.Plane())
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
    sceneElements.world.addBody(groundBody)
}


function loadBall() {
    let sphereMesh;
    const ballMaterial = new CANNON.Material('ball')
    const sphereBody = new CANNON.Body({
        mass: 0.1, // kg
        shape: new CANNON.Sphere(0.68),
        material: ballMaterial
    })
    sphereBody.linearDamping = sphereBody.angularDamping = 0.5
    sphereBody.position.set(2,0,0)
    sceneElements.world.addBody(sphereBody)
    const scaleFactor = 0.7
    gltfLoader.load( "rocket_league_ball.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor,scaleFactor,scaleFactor)
        gltf.scene.name = "ball_1"
        sphereMesh = gltf.scene
        sceneElements.sceneGraph.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `loadBall() - Error loading model rocket_league_ball.glb:\n${error}`);
    } );

    // Link visual and physics world
    sceneElements.world.addEventListener('postStep', () => {
        if (sphereMesh != undefined){
            sphereMesh.position.copy(sphereBody.position)
            sphereMesh.quaternion.copy(sphereBody.quaternion)
        }
    })

    // Define interactions between ball and ground
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const ball_ground = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
        friction: 0.5,
        restitution: 0.7,
    })
    sceneElements.world.addContactMaterial(ball_ground)
}

function loadCar() {
    const frontX = -0.40;    // same for both wheels at the front
    const frontY = 0.02;     // same for both wheels at the front
    const frontZ =  0.30;    // symetric for both wheels at the front
    const backX = 0.45;    // same for both wheels at the back
    const backY = 0.02;   // same for both wheels at the back
    const backZ = 0.27;    // symetric for both wheels at the back
    const scaleFactor = 0.01

    // Build the car chassis
    const chassisShape = new CANNON.Box(new CANNON.Vec3(0.71, 0.20, 0.4))
    const chassisBody = new CANNON.Body({ mass: 100 })
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(0, 4, -5)

    // Create the vehicle
    const vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
    })

    const wheelOptions = {
        radius: 0,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 30,
        suspensionRestLength: 0,
        frictionSlip: 1.4,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.01,
        axleLocal: new CANNON.Vec3(0, 0, 1),
        chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
        maxSuspensionTravel: 0.3,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,
    }

    let chassisVisual;
    // chassis
    gltfLoader.load( "rocket_league_octane_chassis.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.name = "chassis_2"
        chassisVisual = gltf.scene
        sceneElements.sceneGraph.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Error loading model chassis: ${error}`);
    } );

    // front right
    gltfLoader.load( "rocket_league_octane_wheel_fl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(frontX)
        gltf.scene.translateZ(-frontZ)
        gltf.scene.name = "wheel_3"
        sceneElements.sceneGraph.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Front Right Wheel - Error loading model rocket_league_octane_wheel_fl.glb:\n${error}`);
    } );
    wheelOptions.radius = 0.124
    wheelOptions.suspensionRestLength = 0.48
    wheelOptions.chassisConnectionPointLocal.set(frontX, frontY, -frontZ)
    vehicle.addWheel(wheelOptions)

    // front left
    gltfLoader.load( "rocket_league_octane_wheel_fl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(frontX)
        gltf.scene.translateZ(frontZ)
        gltf.scene.rotateY(Math.PI)
        gltf.scene.name = "wheel_4"
        sceneElements.sceneGraph.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Front Left Wheel - Error loading model rocket_league_octane_wheel_fl.glb:\n${error}`);
    } );
    wheelOptions.chassisConnectionPointLocal.set(frontX , frontY, frontZ)
    vehicle.addWheel(wheelOptions)

    // back right
    gltfLoader.load( "rocket_league_octane_wheel_bl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(backX)
        gltf.scene.translateZ(-backZ)
        gltf.scene.name = "wheel_5"
        sceneElements.sceneGraph.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Back Right Wheel - Error loading model rocket_league_octane_wheel_bl.glb:\n${error}`);
    } );
    wheelOptions.radius = 0.142
    wheelOptions.suspensionRestLength = 0.45
    wheelOptions.chassisConnectionPointLocal.set(backX, backY, -backZ)
    vehicle.addWheel(wheelOptions)

    // back left
    gltfLoader.load( "rocket_league_octane_wheel_bl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(backX)
        gltf.scene.translateZ(backZ)
        gltf.scene.rotateY(Math.PI)
        gltf.scene.name = "wheel_6"
        sceneElements.sceneGraph.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Back Left Wheel - Error loading model rocket_league_octane_wheel_bl.glb:\n${error}`);
    } );
    wheelOptions.chassisConnectionPointLocal.set(backX, backY, backZ)
    vehicle.addWheel(wheelOptions)

    vehicle.addToWorld(sceneElements.world)
    sceneElements.vehicle = vehicle

    // Add the wheel bodies
    const wheelBodies = []
    const wheelMaterial = new CANNON.Material('wheel')
    vehicle.wheelInfos.forEach((wheel, i) => {
        // isBack ? backValue : frontValue
        const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, i + 3 < 5 ? 0.11 : 0.11, 20)
        const wheelBody = new CANNON.Body({
            mass: 0,
            material: wheelMaterial,
        })
        console.log(wheelBody)
        wheelBody.type = CANNON.Body.KINEMATIC
        wheelBody.collisionFilterGroup = 0 // turn off collisions
        const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
        wheelBodies.push(wheelBody)
        sceneElements.world.addBody(wheelBody)
    })

    // Define interactions between wheels and ground
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
        friction: 0.3,
        restitution: 0,
        contactEquationStiffness: 10000000,
    })
    sceneElements.world.addContactMaterial(wheel_ground)

    // Update the wheel bodies + car
    sceneElements.world.addEventListener('postStep', () => {
        if (chassisVisual!=undefined){
            chassisVisual.position.copy({x: chassisBody.position.x + 0.055, y: chassisBody.position.y - 0.49, z: chassisBody.position.z})
            chassisVisual.quaternion.copy(chassisBody.quaternion)

            // update wheels
            for (let i = 0; i < vehicle.wheelInfos.length; i++) {
                vehicle.updateWheelTransform(i)
                const transform = vehicle.wheelInfos[i].worldTransform
                const transform_position = transform.position
                const wheelBody = wheelBodies[i]
                wheelBody.position.copy(transform.position)
                wheelBody.quaternion.copy(transform.quaternion)
                const wheelVisual = sceneElements.sceneGraph.getObjectByName("wheel_" + (3 + i))
                if (wheelVisual != undefined){
                    wheelVisual.position.copy(transform.position)

                    if (i + 3 == 4 || i + 3 == 6){
                        // if they are right wheels we need to flip them
                        const flip_y = new CANNON.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
                        wheelVisual.quaternion.copy(flip_y.mult(transform.quaternion))
                    } else {
                        wheelVisual.quaternion.copy(transform.quaternion)
                    }
                }
            }
        }
    })
}

function loadNameText() {
    const fontLoader = new FontLoader();

    fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const materials = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];

        const textOptions = {
            font: font,
            size: 80,
            depth: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        }

        const letter_mass = 10

        const models = [
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.46, 0.5, 0.1))
                }),
                "letter": "M",
                "x": 0,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "I",
                "x": 1,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "G",
                "x": 2,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "U",
                "x": 3,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "E",
                "x": 4,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "L",
                "x": 5,
            },
            {
                "body": null,
                "letter": " ",
                "x": null,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "F",
                "x": 7,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "I",
                "x": 8,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "G",
                "x": 9,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "U",
                "x": 10,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "E",
                "x": 11,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "I",
                "x": 12,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "R",
                "x": 13,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "E",
                "x": 14,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "D",
                "x": 15,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "O",
                "x": 16,
            }
        ]

        for (let index = 0; index < models.length; index++) {
            let dict = models[index]
            let textBody = dict.body
            if (textBody == null)
                continue
            if (dict.letter != 'M')
                continue


            const textGeometry = new TextGeometry( dict.letter,  textOptions);
            const textMesh = new THREE.Mesh( textGeometry, materials );
            textMesh.scale.set(0.01, 0.01, 0.01)
            textMesh.name = "name"
            const center = new THREE.Vector3()
            textGeometry.center()
            textMesh.translateY(0.49)
            textBody.position.set(0,1,0)
            sceneElements.world.addBody(textBody)
            sceneElements.sceneGraph.add(textMesh)

            // Link visual and physics world
            /* sceneElements.world.addEventListener('postStep', () => {
                if (textMesh != undefined){
                    textMesh.position.copy(textBody.position)
                    textMesh.quaternion.copy(textBody.quaternion)
                }
            }) */
        }


    }, undefined, function ( error ) {
        console.error( `Error Loading Font:\n${error}`);
    } );
}



function getPhysicsWorldId(visual_world_name) {
    return parseInt(visual_world_name.split("_").pop())
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