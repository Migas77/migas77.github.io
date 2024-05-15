import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";
import {getImage, loadImage} from "./myImageLoader.js";

const scaleFactor = 0.06
const filename_frame = "glb/low_poly_framed_painting.glb"
export function loadPainting(gltfLoader, filename_photo, position, rotation_y) {
    const group = new THREE.Group();

    gltfLoader.load( filename_frame, function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
            }
        })
        const box = new THREE.Box3().setFromObject( gltf.scene );
        const center = box.getCenter(new THREE.Vector3())
        gltf.scene.position.sub(center)
        group.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Error loading model chassis: ${error}`);
    } );

    const image = getImage(
        filename_photo,
        3.30, // 3
        2.04, // 2.25
        {x: 0, y: 0, z: 0.02},
        0
    )
    group.add(image)

    group.position.set(position.x, position.y, position.z)
    group.rotateY(rotation_y)
    sceneElements.sceneGraph.add(group)

    // physics world
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const paintingShape = new CANNON.Box(new CANNON.Vec3(0.5 * 3.54, 0.5 * 2.04, 0.5 * 0.12))
    const paintingBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })
    paintingBody.addShape(paintingShape, group.position, group.quaternion)
    sceneElements.world.addBody(paintingBody)

    // No need to link visual and physics world
    // because the painting won't move

}