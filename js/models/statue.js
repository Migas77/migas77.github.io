import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";

export function loadStatueAndPassVisual(gltfLoader, filename, scaleFactor, need_bounding_box, position_x_z, offset, rotation_y, visual_object = null) {
    const baseGroup = new THREE.Group()
    const material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    const top_measures = {width: 2.8, height: 0.1}
    const bottom_measures = {width: 3, height: 0.6}

    const topGeometry = new THREE.BoxGeometry( top_measures.width, top_measures.height, top_measures.width);
    const top = new THREE.Mesh( topGeometry, material );
    top.translateY(bottom_measures.height + top_measures.height * 0.5 )
    top.castShadow = true
    top.receiveShadow = true
    baseGroup.add(top)

    const bottomGeometry = new THREE.BoxGeometry( bottom_measures.width, bottom_measures.height, bottom_measures.width);
    const bottom = new THREE.Mesh( bottomGeometry, material );
    bottom.translateY(bottom_measures.height * 0.5)
    bottom.castShadow = true
    bottom.receiveShadow = true
    baseGroup.add(bottom)

    const filepath = filename
    gltfLoader.load( filepath, function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.name = filename
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const size = bbox.getSize(new THREE.Vector3())
        // let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
        // sceneElements.sceneGraph.add(helper)
        gltf.scene.position.set(
            offset.x,
            need_bounding_box ? bottom_measures.height + top_measures.height + offset.y + 0.5 * size.y: bottom_measures.height + top_measures.height + offset.y,
            offset.z
        )
        gltf.scene.rotation.y = rotation_y
        if (visual_object !== null){
            visual_object.model = gltf.scene
        }
        baseGroup.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Error loading statue model ${filepath}:\n${error}`);
    } );

    baseGroup.position.set(position_x_z.x, 0, position_x_z.z)
    sceneElements.sceneGraph.add(baseGroup)


    // physics world
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const bottomBoxShape = new CANNON.Box(new CANNON.Vec3(0.5 * bottom_measures.width, 0.5 * bottom_measures.height, 0.5 * bottom_measures.width))
    const topBoxShape = new CANNON.Box(new CANNON.Vec3(0.5 * top_measures.width, 0.5 * top_measures.height, 0.5 * top_measures.width))
    const statueBaseBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })
    statueBaseBody.addShape(bottomBoxShape, new CANNON.Vec3(position_x_z.x, bottom_measures.height * 0.5, position_x_z.z))
    statueBaseBody.addShape(topBoxShape, new CANNON.Vec3(position_x_z.x, bottom_measures.height + top_measures.height * 0.5, position_x_z.z))
    sceneElements.world.addBody(statueBaseBody)

    // No need to link visual and physics world
    // because the statue won't move
    return [baseGroup, statueBaseBody]
}

export function loadAnimatedStatue(gltfLoader, filename, scaleFactor, need_bounding_box, position_x_z, offset, rotation_y, animation_name, animations) {
    const baseGroup = new THREE.Group()
    const material = new THREE.MeshPhongMaterial( {color: 0xFFFFFF} );
    const top_measures = {width: 2.8, height: 0.1}
    const bottom_measures = {width: 3, height: 0.6}

    const topGeometry = new THREE.BoxGeometry( top_measures.width, top_measures.height, top_measures.width);
    const top = new THREE.Mesh( topGeometry, material );
    top.translateY(bottom_measures.height + top_measures.height * 0.5 )
    top.castShadow = true
    top.receiveShadow = true
    baseGroup.add(top)

    const bottomGeometry = new THREE.BoxGeometry( bottom_measures.width, bottom_measures.height, bottom_measures.width);
    const bottom = new THREE.Mesh( bottomGeometry, material );
    bottom.translateY(bottom_measures.height * 0.5)
    bottom.castShadow = true
    bottom.receiveShadow = true
    baseGroup.add(bottom)

    const filepath = filename
    gltfLoader.load( filepath, function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.name = filename
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        const mixer = new THREE.AnimationMixer(gltf.scene)
        animations.push({
            mixer: mixer,
            clock: new THREE.Clock()
        })
        const clip = THREE.AnimationClip.findByName(gltf.animations, animation_name)
        const action = mixer.clipAction(clip)
        action.play()

        const bbox = new THREE.Box3().setFromObject(gltf.scene);
        const size = bbox.getSize(new THREE.Vector3())
        // let helper = new THREE.Box3Helper(bbox, new THREE.Color(0, 255, 0));
        // sceneElements.sceneGraph.add(helper)
        gltf.scene.position.set(
            offset.x,
            need_bounding_box ? bottom_measures.height + top_measures.height + offset.y + 0.5 * size.y: bottom_measures.height + top_measures.height + offset.y,
            offset.z
        )
        gltf.scene.rotation.y = rotation_y
        baseGroup.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Error loading statue model ${filepath}:\n${error}`);
    } );

    baseGroup.position.set(position_x_z.x, 0, position_x_z.z)
    sceneElements.sceneGraph.add(baseGroup)


    // physics world
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const bottomBoxShape = new CANNON.Box(new CANNON.Vec3(0.5 * bottom_measures.width, 0.5 * bottom_measures.height, 0.5 * bottom_measures.width))
    const topBoxShape = new CANNON.Box(new CANNON.Vec3(0.5 * top_measures.width, 0.5 * top_measures.height, 0.5 * top_measures.width))
    const statueBaseBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })
    statueBaseBody.addShape(bottomBoxShape, new CANNON.Vec3(position_x_z.x, bottom_measures.height * 0.5, position_x_z.z))
    statueBaseBody.addShape(topBoxShape, new CANNON.Vec3(position_x_z.x, bottom_measures.height + top_measures.height * 0.5, position_x_z.z))
    sceneElements.world.addBody(statueBaseBody)

    // No need to link visual and physics world
    // because the statue won't move
}