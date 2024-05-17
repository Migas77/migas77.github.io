import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";
import {brick_audios} from "../main.js";

const material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
export function loadBrick(width, height, depth, position, rotation_y){

    // visual world
    const brick_geometry = new THREE.BoxGeometry( width, height, depth);
    const brick = new THREE.Mesh( brick_geometry, material );
    brick.castShadow = true
    brick.receiveShadow = true
    brick_audios.forEach((brick_audio) => brick.add(brick_audio))
    sceneElements.sceneGraph.add(brick)

    // physics world
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const brickShape = new CANNON.Box(new CANNON.Vec3(0.5 * width, 0.5 * height, 0.5 * depth))
    const brickBody = new CANNON.Body({
        mass: 0.1,
        material: groundMaterial,
    })
    brickBody.position.set(position.x, 0.5 * height + position.y, position.z)
    brickBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), rotation_y)
    brickBody.addShape(brickShape)
    // The Pile of Bricks slides a bit. (the pile would end up falling)
    // By doing this they won't move until they are crashed into
    brickBody.allowSleep = true
    brickBody.sleepSpeedLimit = 0.2
    brickBody.sleepTimeLimit = 1


    brickBody.addEventListener("collide", function (event) {
        if (event.body === sceneElements.world.bodies[0] && event.contact.getImpactVelocityAlongNormal() > 0.2){
            // play randomly one of the brick hit sounds
            const random_index = Math.floor(Math.random() * brick_audios.length)
            brick_audios[random_index].play()
        }
    })
    sceneElements.world.addBody(brickBody)

    // Link visual and physics world
    sceneElements.world.addEventListener('postStep', () => {
        if (brick !== undefined){
            brick.position.copy(brickBody.position)
            brick.quaternion.copy(brickBody.quaternion)
        }
    })

    return brickBody

}



