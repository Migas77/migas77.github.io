import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";

/*
side: 1
position_x_z: {x: 0, z: 0}
*/
const tile_height = 0.02
export function loadTile(side, position_x_z, rotation_y){
    // visual world
    const geometry = new THREE.BoxGeometry( side, tile_height, side );
    const material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    const tile = new THREE.Mesh( geometry, material );
    tile.position.set(position_x_z.x, 0.5 * tile_height, position_x_z.z)
    tile.rotateY(rotation_y)
    tile.receiveShadow = true
    tile.castShadow = true
    sceneElements.sceneGraph.add( tile );

    // physics world
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const boxShape = new CANNON.Box(new CANNON.Vec3(0.5 * side, 0.5 * tile_height, 0.5 * side))
    const boxBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })
    boxBody.addShape(boxShape)
    boxBody.position.copy(tile.position)
    boxBody.quaternion.copy(tile.quaternion)
    sceneElements.world.addBody(boxBody)

    // No need to link visual and physics world
    // because the tile won't move

}