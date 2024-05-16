import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {sceneElements} from "../sceneElements.js";
import {loading_manager} from "../main.js";

// ************************** //
// 1. loadGround() - Load, add to the scene and world the ball model at the position (0,0,0)
// ************************** //

export function loadGround() {
    // const shaderMaterial = new THREE.ShaderMaterial( {
    //
    //     uniforms: {
    //         color1: { value: new THREE.Vector3(0.2, 0.4, 0.8) }, // Light blue
    //         color2: { value: new THREE.Vector3(0.1, 0.2, 0.5) }  // Dark blue
    //     },
    //     vertexShader: `
    //         varying vec2 vUv;
    //
    //         void main() {
    //             vUv = uv;
    //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    //         }
    //     `,
    //     fragmentShader: `
    //         uniform vec3 color1;
    //         uniform vec3 color2;
    //
    //         varying vec2 vUv;
    //
    //         void main() {
    //             // Create a gradient based on the horizontal position (u coordinate) of the UV coordinate
    //             vec3 gradientColor = mix(color1, color2, vUv.x);
    //
    //             // Output the final color
    //             gl_FragColor = vec4(gradientColor, 1.0);
    //         }
    //     `,
    // } );

    // Visual Representation
    // #1098F7
    // #A1D1FF
    // const texture = textureLoader.load("matcaps/another_blue_2.png")
    const planeGeometry = new THREE.PlaneGeometry(300, 300);
    const planeMaterial = new THREE.MeshPhongMaterial({color: "#A1D1FF"});
    // const planeMaterial = new THREE.MeshPhongMaterial({map: texture});
    const planeObject = new THREE.Mesh(planeGeometry, planeMaterial);
    planeObject.rotation.x = - Math.PI/2
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