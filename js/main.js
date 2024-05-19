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
import { loadAnimatedStatueAndPassCallback, loadStatueAndPassCallback } from "./models/statue.js";
import {loadImage} from "./models/myImageLoader.js";
import {loadTile} from "./models/tile.js";
import {loadBrick} from "./models/brick.js";
import {open_link} from "./utils.js";
import {resetElementsInCollection, saveElementInCollection} from "./models/brick_utils.js";
import {loadAudioLoop} from "./myAudioLoader.js";

let debugcannon;

// loading manager
export const loading_manager = new THREE.LoadingManager()
// loaders
export const textureLoader = new THREE.TextureLoader(loading_manager);
export const gltfLoader = new GLTFLoader(loading_manager);
export const fontLoader = new FontLoader(loading_manager);
export const audioLoader = new THREE.AudioLoader(loading_manager)
export const listener = new THREE.AudioListener();
// Camera Positions
const [cameraOffsetX, cameraOffsetY, cameraOffsetZ] = [8, 6.7, 8]
let death_star_visual
let death_star_step = 0
let x_wing_visual
let x_wing_step = 0
// HELPER FUNCTIONS

const helper = {

    initEmptyScene: function (sceneElements) {

        // ************************** //
        // Put a Loading Screen
        // ************************** //
        const loading_progress_bar = document.getElementById("loading_progress_bar")
        loading_manager.onProgress = function (url, itemsLoaded, itemsTotal){
            loading_progress_bar.style.transform = `translateX(-${100-(100 * itemsLoaded/itemsTotal)}%)`
        }
        loading_manager.onLoad = function (){
            const start_playing_button = document.getElementById("start_playing_button")
            start_playing_button.style.opacity = "1"
            const loading_text = document.getElementById("loading_text")
            loading_text.innerText = "Loaded!"
            start_playing_button.addEventListener("click", function (event){
                const loading_div = document.getElementById("loading_animation")
                loading_div.style.opacity = "0";
                setTimeout(() => {
                    loading_div.remove();
                }, 1000);
                // start playing music
                const stormtrooper = sceneElements.sceneGraph.getObjectByName("glb/stormtrooper_dancing.glb")
                const audio = stormtrooper.children[2].children[1]
                audio.play()
            })
        }

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
        sceneElements.camera.add(listener);

        // ************************** //
        // Illumination
        // ************************** //

        // ************************** //
        // Add ambient light
        // ************************** //
        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 0.8);
        sceneElements.sceneGraph.add(ambientLight);

        const dirLight = new THREE.DirectionalLight( 'rgb(255, 255, 255)', 1);
        dirLight.position.set(-20, 10, 0)
        dirLight.name = "directional_light"
        dirLight.shadowMapWidth = 2048
        dirLight.shadowMapHeight = 2048
        dirLight.shadow.mapSize.width = 2000
        dirLight.shadow.mapSize.height = 2000
        dirLight.shadow.camera.left = -105
        dirLight.shadow.camera.right = 105
        dirLight.shadow.camera.top = 205
        dirLight.shadow.camera.bottom = -205
        dirLight.shadow.camera.near = 0.5
        dirLight.shadow.camera.far = 300

        dirLight.castShadow = true


        // sceneElements.sceneGraph.add(dirLight)
        const helper = new THREE.CameraHelper(dirLight.shadow.camera)
        // sceneElements.sceneGraph.add(helper)


        // ***************************** //
        // Add spotlight (with shadows)
        // ***************************** //
        const spotLight1 = new THREE.SpotLight('rgb(255, 255, 255)', 40);
        spotLight1.decay = 1;
        spotLight1.position.set(45, 10, 0);
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
        // sleeps objects with really low velocity
        // for example, the pile of bricks slides a bit. By doing this they won't move until they are crashed into
        sceneElements.world.allowSleep = true

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
        loadCar({x: 0, y: 1, z: -13.5});
        saveElementInCollection("brick_piles", loadBall({x: -14, y:5, z: 2}));
        // entrance tiles
        loadTile(0.5, {x: -0.4, z: -12}, 0, 0)
        loadTile(0.5, {x: 0.2, z: -11}, 0)
        loadTile(0.5, {x: -0.2, z: -10}, 0)
        loadTile(0.5, {x: 0.4, z: -9}, 0)
        loadNameText({x: -5.5, z: -8});
        loadTile(0.5, {x: -0.1, z: -7}, 0)
        loadTile(0.5, {x: 0.2, z: -6.2}, 0)
        loadTile(0.5, {x: 0, z: -5}, 0)
        loadTile(0.5, {x: -0.3, z: -4.2}, 0)
        loadTile(0.5, {x: 0.4, z: -3.3}, 0)
        loadTile(0.5, {x: 0.1, z: -2.5}, 0)
        loadTile(0.5, {x: -0.3, z: -1.8}, 0)
        loadTile(0.5, {x: 0, z: -1}, 0)

        // Statues
        loadStatueAndPassCallback(
            gltfLoader,
            "glb/heavy_infantry_mandalorian_funko_pop.glb",
            16,
            true,
            {x: 0, z: 2},
            {x: 0.12, y:-0.17, z:0},
            -0.6
        )
        loadAnimatedStatueAndPassCallback(
            gltfLoader,
            "glb/x_wing.glb",
            0.23,
            true,
            {x: 5.5, z: 7.5},
            {x: 0, y:0.6, z:0},
            0,
            "Attack Position",
            (model) => x_wing_visual = model
        );
        loadAnimatedStatueAndPassCallback(
            gltfLoader,
            "glb/stormtrooper_dancing.glb",
            1.3,
            false,
            {x: -5.5, z: -3.5},
            {x: 0, y: 0, z: 0},
            0.8,
            "mixamo.com",
            (model) => loadAudioLoop("sounds/drum_loop.mp3", model)
        )
        loadAnimatedStatueAndPassCallback(
            gltfLoader,
            "glb/bb8_animated_star_wars-v1.glb",
            0.8,
            false,
            {x: 5.5, z: -3.5},
            {x: 0.8, y:0, z:0.2},
            0,
            "Take 01",
        )
        loadStatueAndPassCallback(
            gltfLoader,
            "glb/death_star.glb",
            0.1,
            true,
            {x: -5.5, z: 7.5},
            {x: 0, y:0.3, z:0},
            0,
            (model) => death_star_visual = model
        )

        // Road Signs
        loadRoadSign(fontLoader, "INFORMATION", 0, 7.5, Math.PI/2, 0.06, false)
        loadRoadSign(fontLoader, "PROJECTS", 5.5, 2, 0, 0.06, true)
        loadRoadSign(fontLoader, "PLAYGROUND", -5.5, 2, 0, 0.06, false)

        // Information Section
        loadTile(0.5, {x: -0.3, z: 8.2}, 0)
        loadTile(0.5, {x: 0.2, z: 9.2}, 0)
        loadTile(0.5, {x: -0.1, z: 10}, 0)
        loadTile(0.5, {x: 0.5, z: 10.6}, 0)
        loadTile(0.5, {x: 0, z: 11.3}, 0)
        loadTile(0.5, {x: -0.4, z: 12}, 0)
        loadTile(0.5, {x: -0.2, z: 12.8}, 0)
        loadTile(0.5, {x: 0.1, z: 13.5}, 0)
        loadTile(0.5, {x: -0.3, z: 14.2}, 0)
        loadLightPole({x: -1.4, y:0, z:14.4}, Math.PI)
        loadButton(1.4, 1.4, {x: 1.4, z: 14.4}, 0x000000, "Github", () => open_link("https://github.com/Migas77"))
        loadImage("images/github_logo.png", 2.31, 1.54, {x:1.4, y:0.01, z:14.4}, -Math.PI/2, -4)
        loadButton(1.4, 1.4, {x: 3.2, z: 14.4}, 0xffffff, "Linkedin", () => open_link("https://www.linkedin.com/in/miguel-figueiredo-1495bb284/"))
        loadImage("images/linkedin_logo.png", 1.65, 1.65, {x:3.2, y:0.01, z:14.4}, -Math.PI/2, -3)
        loadButton(1.4, 1.4, {x: 5, z: 14.4}, 0x000000, "Mail", () => open_link("mailto:miguel.belchior@ua.pt"))
        loadImage("images/email_logo.png", 1.05, 1.05, {x:5, y:0.01, z:14.4}, -Math.PI/2, -2)
        loadImage("images/HISTORY_OF_MY_LIFE.png", 5, 5, {x:-0.8, y:0.01, z:16}, -Math.PI/2, -1)
        loadImage("images/HISTORY_OF_MY_LIFE_DETAILS.png", 7, 7, {x:2, y:0.02, z:17.4}, -Math.PI/2)

        // Projects Section
        loadTile(0.5, {x: 8.5, z: 2.4}, 0)
        loadTile(0.5, {x: 9.2, z: 2}, 0)
        loadTile(0.5, {x: 10, z: 2.3}, 0)
        loadTile(0.5, {x: 10.9, z: 2}, 0)
        loadTile(0.5, {x: 11.7, z: 2.3}, 0)
        loadTile(0.5, {x: 12.4, z: 1.7}, 0)
        loadTile(0.5, {x: 13.2, z: 2}, 0)
        loadPainting(gltfLoader, "images/sub19_subida.jpeg", {x: 17.2, y: 1.3, z: -1}, 0.49)
        loadPainting(gltfLoader, "images/AFC.jpeg", {x: 21.2, y: 1.3, z: -1}, 0.49)
        loadPainting(gltfLoader, "images/sub19_homenagem_subida.jpeg", {x: 25.2, y: 1.3, z: -1}, 0.49)
        loadTile(0.5, {x: 24.4, z: 1.3}, -Math.PI/20)
        loadTile(0.5, {x: 25.2, z: 2}, -Math.PI/20)
        loadTile(0.5, {x: 26.1, z: 1.6}, -Math.PI/20)
        loadTile(0.5, {x: 27.0, z: 2}, -Math.PI/20)
        loadTile(0.5, {x: 26.3, z: 2.5}, -Math.PI/20)
        loadTile(0.5, {x: 27.6, z: 3}, -Math.PI/20)
        loadPainting(gltfLoader, "images/KeyUsageProfiler_3.png", {x: 17.2, y: 1.3, z: 8}, 0.49)
        loadPainting(gltfLoader, "images/KeyUsageProfiler_2.png", {x: 21.2, y: 1.3, z: 8}, 0.49)
        loadPainting(gltfLoader, "images/KeyUsageProfiler_1.png", {x: 25.2, y: 1.3, z: 8}, 0.49)
        loadTile(0.5, {x: 8.5, z: 10.6}, 0)
        loadTile(0.5, {x: 9.2, z: 11}, 0)
        loadTile(0.5, {x: 10, z: 10.7}, 0)
        loadTile(0.5, {x: 10.9, z: 11}, 0)
        loadTile(0.5, {x: 11.7, z: 10.7}, 0)
        loadTile(0.5, {x: 12.4, z: 11.3}, 0)
        loadTile(0.5, {x: 13.2, z: 11}, 0)
        loadTile(0.5, {x: 24.4, z: 11.7}, -Math.PI/20)
        loadTile(0.5, {x: 25.2, z: 11}, -Math.PI/20)
        loadTile(0.5, {x: 26.1, z: 11.4}, -Math.PI/20)
        loadTile(0.5, {x: 27.0, z: 11}, -Math.PI/20)
        loadTile(0.5, {x: 26.3, z: 10.5}, -Math.PI/20)
        loadTile(0.5, {x: 27.6, z: 10}, -Math.PI/20)



        // Playground Section - 2
        loadTile(0.5, {x: -10, z: 1.7}, 0)
        loadTile(0.5, {x: -11, z: 2.1}, 0)
        loadTile(0.5, {x: -12.2, z: 1.4}, 0)
        loadTile(0.5, {x: -13, z: 2}, 0)

        // First Wall

        // First Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0, z: 4}, 0))
        // Second Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.4, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.4, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.4, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.4, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.4, z: 4}, 0))
        // Third row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.8, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.8, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.8, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.8, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 0.8, z: 4}, 0))
        // Fourth Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.2, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.2, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.2, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.2, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.2, z: 4}, 0))
        // Fifth Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.6, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.6, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.6, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.6, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -18, y: 1.6, z: 4}, 0))

        // Second Wall
        // First Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0, z: 4}, 0))
        // Second Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.4, z: -0.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.4, z: 0.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.4, z: 1.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.4, z: 2.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.4, z: 3.5}, 0))
        // Third row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.8, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.8, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.8, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.8, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 0.8, z: 4}, 0))
        // Fourth Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.2, z: -0.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.2, z: 0.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.2, z: 1.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.2, z: 2.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.2, z: 3.5}, 0))
        // Fifth Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.6, z: 0}, 0),)
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.6, z: 1}, 0),)
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.6, z: 2}, 0),)
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -22, y: 1.6, z: 3}, 0),)

        // Third Wall
        // First Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0, z: 0}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0, z: 3}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0, z: 4}, 0))
        // Second Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0.4, z: 0.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0.4, z: 1.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0.4, z: 2.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0.4, z: 3.5}, 0))
        // Third Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0.8, z: 1}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0.8, z: 2}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 0.8, z: 3}, 0))
        // Fourth Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 1.2, z: 1.5}, 0))
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 1.2, z: 2.5}, 0))
        // Fifth Row
        saveElementInCollection("brick_piles", loadBrick(0.6, 0.4, 0.9, {x: -26, y: 1.6, z: 2}, 0))

        loadButton(1.4, 1.4, {x: -15.5, z: 0}, 0xffffff, "ResetBrickWalls",() => resetElementsInCollection("brick_piles"))



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
const maxForce = 200
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

    // animate death star
    if (death_star_visual !== undefined){
        death_star_step += 0.01
        death_star_visual.rotation.y = death_star_step
    }
    // animate x-wing
    const x_wing = sceneElements.animated_models["glb/x_wing.glb"]
    if (x_wing !== undefined && x_wing_visual !== undefined){
        // the wings should be extended while the x_wind is in the air
        // and retracted when is about to land
        x_wing_step += 0.01
        x_wing_visual.rotation.z += 0.005 * Math.cos(x_wing_step)
        x_wing.mixer.update(x_wing.clock.getDelta())
    }
    // play models own animations
    const bb8 = sceneElements.animated_models["glb/bb8_animated_star_wars-v1.glb"]
    if (bb8 !== undefined)
        bb8.mixer.update(bb8.clock.getDelta())
    const stormtrooper = sceneElements.animated_models["glb/stormtrooper_dancing.glb"]
    if (stormtrooper !== undefined){
        stormtrooper.mixer.update(stormtrooper.clock.getDelta())
    }



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
        // sceneElements.vehicle.chassisBody.applyImpulse(oppositeForce, sceneElements.vehicle.chassisBody.position)
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