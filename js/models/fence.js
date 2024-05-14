import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import { sceneElements, getPhysicsWorldId } from "../sceneElements.js";

function loadFenceItem(position, rotation_y) {
    const fenceItem = new THREE.Group();

    const fenceSupportXZ = 0.1
    const fenceSupportY = 1.12
    const fenceFrontX = 1.65
    const fenceFrontY = 0.4
    const fenceFrontZ = 0.1

    const fenceSupportGeometry1 = new THREE.BoxGeometry( fenceSupportXZ, fenceSupportY, fenceSupportXZ );
    const fenceSupportMaterial1 = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    const fenceSupport1 = new THREE.Mesh( fenceSupportGeometry1, fenceSupportMaterial1 );
    fenceSupport1.translateY(0.5 * fenceSupportY)
    fenceSupport1.receiveShadow = true
    fenceSupport1.castShadow = true

    const fenceSupportGeometry2 = new THREE.BoxGeometry( fenceSupportXZ, fenceSupportY, fenceSupportXZ );
    const fenceSupportMaterial2 = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    const fenceSupport2 = new THREE.Mesh( fenceSupportGeometry2, fenceSupportMaterial2 );
    fenceSupport2.translateX(1.35)
    fenceSupport2.translateY(0.5 * fenceSupportY)
    fenceSupport2.receiveShadow = true
    fenceSupport2.castShadow = true

    const fenceFrontGeometry1 = new THREE.BoxGeometry( fenceFrontX, fenceFrontY, fenceFrontZ );
    const fenceFrontMaterial1 = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    const fenceFront1 = new THREE.Mesh( fenceFrontGeometry1, fenceFrontMaterial1 );
    fenceFront1.translateX(0.675)
    fenceFront1.translateY(0.4)
    fenceFront1.translateZ(fenceSupportXZ)
    fenceFront1.receiveShadow = true
    fenceFront1.castShadow = true

    const fenceFrontGeometry2 = new THREE.BoxGeometry( fenceFrontX, fenceFrontY, fenceFrontZ );
    const fenceFrontMaterial2 = new THREE.MeshPhongMaterial( {color: 0xffff00} );
    const fenceFront2 = new THREE.Mesh( fenceFrontGeometry2, fenceFrontMaterial2 );
    fenceFront2.translateX(0.675)
    fenceFront2.translateY(0.84)
    fenceFront2.translateZ(fenceSupportXZ)
    fenceFront2.receiveShadow = true
    fenceFront2.castShadow = true

    fenceItem.add(fenceSupport1)
    fenceItem.add(fenceSupport2)
    fenceItem.add(fenceFront1)
    fenceItem.add(fenceFront2)


    fenceItem.position.set(position.x, position.y, position.z)
    return fenceItem
}

function loadFenceGroup(position_x_z, rotation_y, name) {
    const fenceGroup = new THREE.Group();
    for (let i = 0; i < 24; i++) {
        let fenceItem = loadFenceItem({x: 1.68*i, y:0, z:0}, 0)
        fenceGroup.add(fenceItem)
    }

    fenceGroup.position.set(position_x_z.x, 0, position_x_z.z)
    fenceGroup.rotateY(rotation_y)
    new THREE.Box3().setFromObject(fenceGroup).getCenter(fenceGroup.position).multiplyScalar(-1) // center
    fenceGroup.translateY(0.56)
    fenceGroup.name = name
    sceneElements.sceneGraph.add(fenceGroup)

    // Physic Representation of the wall of fence items
    const offset = 0.1
    if (position_x_z.x !== 0)
        position_x_z.x = position_x_z.x > 0 ? position_x_z.x - offset : position_x_z.x + offset
    if (position_x_z.z !== 0)
        position_x_z.z = position_x_z.z > 0 ? position_x_z.z - offset : position_x_z.z + offset
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const fenceBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })
    fenceBody.addShape(new CANNON.Plane())
    fenceBody.position.set(-position_x_z.x, 0, -position_x_z.z)
    fenceBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotation_y)
    sceneElements.world.addBody(fenceBody) // when I uncomment this line the car starts flying
}

export function loadFence() {
    const side_size = 30
    const fences = [
        {position_x_z: {x: 0, z: side_size}, rotation_y: 0, name: "upper_fence"},
        {position_x_z: {x: side_size, z: 0}, rotation_y: Math.PI/2, name: "right_fence"},
        {position_x_z: {x: 0, z: -side_size}, rotation_y: Math.PI, name: "lower_fence"},
        {position_x_z: {x: -side_size, z: 0}, rotation_y: -Math.PI/2, name: "left_fence"},
    ]

    for (const fence of fences) {
        loadFenceGroup(fence.position_x_z, fence.rotation_y, fence.name)
    }
}