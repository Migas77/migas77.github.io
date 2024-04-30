import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {sceneElements} from "../sceneElements.js";

// ************************** //
// 1. loadGround() - Load, add to the scene and world the ball model at the position (0,0,0)
// ************************** //
export function loadGround() {
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