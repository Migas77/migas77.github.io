import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";
import {gltfLoader} from "../main.js";

// ************************** //
// 1. loadBall() - Load, add to the scene and world the ground model at y = 0
// ************************** //
export function loadBall(position) {
    let sphereMesh;
    const ballMaterial = new CANNON.Material('ball')
    const sphereBody = new CANNON.Body({
        mass: 0.1, // kg
        shape: new CANNON.Sphere(0.68),
        material: ballMaterial
    })
    sphereBody.linearDamping = sphereBody.angularDamping = 0.5
    sphereBody.position.set(position.x,position.y,position.z)
    sphereBody.allowSleep = false
    sceneElements.world.addBody(sphereBody)
    const scaleFactor = 0.7
    gltfLoader.load( "glb/rocket_league_ball.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor,scaleFactor,scaleFactor)
        gltf.scene.name = "ball_1"
        sphereMesh = gltf.scene
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        sceneElements.sceneGraph.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `loadBall() - Error loading model rocket_league_ball.glb:\n${error}`);
    } );

    // Link visual and physics world
    sceneElements.world.addEventListener('postStep', () => {
        if (sphereMesh !== undefined){
            sphereMesh.position.copy(sphereBody.position)
            sphereMesh.quaternion.copy(sphereBody.quaternion)
        }
    })

    // Define interactions between ball and ground
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const ball_ground = new CANNON.ContactMaterial(ballMaterial, groundMaterial, {
        friction: 0.5,
        restitution: 0.8,
    })
    sceneElements.world.addContactMaterial(ball_ground)
    return sphereBody
}