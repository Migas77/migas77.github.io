import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

export function loadRoadSign(fontLoader, message, position_x, position_z, rotation_y, arrow_hitbox_offset, is_right_way) {
    const [sign_visual, sign_physics] = loadRoadSignAtOrigin(
        fontLoader, message, is_right_way, arrow_hitbox_offset,
        0.15, 2.5, 0.15,
        2, 0.4, 0.1
    )
    sign_visual.position.x = position_x
    sign_visual.position.z = position_z
    sign_visual.rotateY(rotation_y)
    sign_physics.position.copy(sign_visual.position)
    sign_physics.quaternion.copy(sign_visual.quaternion)
}

function loadRoadSignAtOrigin(
    fontLoader, message, is_right_way, arrow_hitbox_offset,
    pole_width, pole_height, pole_depth,
    sign_width, sign_height, sign_depth,
) {


    const sign_visual = new THREE.Object3D()

    fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const materials = [
            new THREE.MeshPhongMaterial( { color: 0x000000, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0x000000 } ) // side
        ];

        const textOptions = {
            font: font,
            size: 100,
            depth: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 2,
            bevelOffset: 0,
            bevelSegments: 5
        }

        const textGeometry = new TextGeometry( message,  textOptions);
        const textMesh = new THREE.Mesh( textGeometry, materials );
        const textScale = 0.002
        textMesh.scale.set(textScale, textScale, textScale)
        textMesh.name = "name"
        textGeometry.center()
        textMesh.position.set(
            sign_rectangle_mesh.position.x,
            sign_rectangle_mesh.position.y,
            sign_rectangle_mesh.position.z + 0.72 * sign_depth,
        )
        sign_visual.add(textMesh)


    }, undefined, function ( error ) {
        console.error( `Error Loading Font:\n${error}`);
    } );

    const pole_geometry = new THREE.BoxGeometry( pole_width, pole_height, pole_depth );
    const pole_material = new THREE.MeshPhongMaterial( {color: 0xa0522d} );
    const pole = new THREE.Mesh( pole_geometry, pole_material );
    pole.position.y = 0.5 * pole_height
    pole.castShadow = true
    pole.receiveShadow = true
    sign_visual.add(pole)

    const sign_rectangle_geometry = new THREE.BoxGeometry( sign_width, sign_height, sign_depth );
    const sign_rectangle_material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    const sign_rectangle_mesh = new THREE.Mesh( sign_rectangle_geometry, sign_rectangle_material )
    sign_rectangle_mesh.position.y = 0.5 * sign_height + 0.8 * pole_height
    sign_rectangle_mesh.position.z = sign_depth
    if (is_right_way === true)
        sign_rectangle_mesh.rotation.y = Math.PI
    sign_rectangle_mesh.castShadow = true
    sign_rectangle_mesh.receiveShadow = true
    sign_visual.add(sign_rectangle_mesh);
    const sign_arrow_radius = sign_height / Math.sqrt(3)
    const sign_arrow_geometry = new THREE.CylinderGeometry( sign_arrow_radius, sign_arrow_radius, sign_depth, 3, 1, false, Math.PI/6, 2*Math.PI);
    const sign_arrow_material = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    const sign_arrow_mesh = new THREE.Mesh( sign_arrow_geometry, sign_arrow_material )

    sign_arrow_mesh.position.set(
        is_right_way ? 0.5 * (sign_width + sign_arrow_radius) : - 0.5 * (sign_width + sign_arrow_radius),
        0.5 * sign_height + 0.8 * pole_height,
        sign_depth
    )
    sign_arrow_mesh.rotation.x = Math.PI/2
    if (is_right_way === true)
        sign_arrow_mesh.rotation.y = Math.PI
    sign_arrow_mesh.castShadow = true
    sign_arrow_mesh.receiveShadow = true
    sign_visual.add(sign_arrow_mesh)

    sceneElements.sceneGraph.add(sign_visual);

    // Physics World
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const signBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })
    signBody.addShape(
        // poleShape
        new CANNON.Box(new CANNON.Vec3(0.5 * pole_width, 0.5 * pole_height, 0.5 * pole_depth)),
        pole.position,
        pole.quaternion
    )
    signBody.addShape(
        // sign_rectangle_shape
        new CANNON.Box(new CANNON.Vec3(0.5 * sign_width, 0.5 * sign_height, 0.5 * sign_depth)),
        sign_rectangle_mesh.position,
        sign_rectangle_mesh.quaternion
    )
    signBody.addShape(
        // box instead of sign_arrow_mesh because of the following cannon limitation:
        // cylinder (sign_arrow_mesh) and sphere (ball) don't colide
        new CANNON.Box(new CANNON.Vec3(0.5 * Math.sqrt(3) * sign_height / 2, 0.5 * sign_height, 0.5 * sign_depth)),
        {
            x: is_right_way ? sign_arrow_mesh.position.x + arrow_hitbox_offset : sign_arrow_mesh.position.x - arrow_hitbox_offset,
            y: sign_arrow_mesh.position.y,
            z: sign_arrow_mesh.position.z
        },
    )
    sceneElements.world.addBody(signBody)

    // No need to link visual and physics world
    // because the road sign won't move

    return [sign_visual, signBody]
}