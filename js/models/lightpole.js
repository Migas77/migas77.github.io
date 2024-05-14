import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";

// {x: 0, y:0, z:0}
// rotation_y: 0
export function loadLightPole(position, rotation_y) {
    const [light_pole_visual, light_pole_body] = getLightPoleAtOrigin(
        0.3, 0.6, 1,
        0.2, 3.4, 0.2,
        1.4, 0.15, 0.15,
        0.06, 0.3, 0.06,
        0.18, 0.24, 0.16,
        0.24, 0.18, 0.4,
    )

    light_pole_visual.position.set(position.x, position.y, position.z)
    light_pole_visual.rotateY(rotation_y)
    light_pole_body.position.copy(light_pole_visual.position)
    light_pole_body.quaternion.copy(light_pole_visual.quaternion)

    sceneElements.sceneGraph.add(light_pole_visual)
    sceneElements.world.addBody(light_pole_body)
}

function getLightPoleAtOrigin(
    base_radius_top, base_radius_bottom, base_height,
    pole_width, pole_height, pole_depth,
    top_bar_width, top_bar_height, top_bar_depth,
    light_hanger_width, light_hanger_height, light_hanger_depth,
    light_capsule_top, light_capsule_bottom, light_capsule_height,
    light_top, light_bottom, light_height,
) {
    const light_group = new THREE.Group()

    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const light_pole_body = new CANNON.Body({
        type: CANNON.Body.STATIC,
        material: groundMaterial
    })


    // lightpole base
    const base_geometry = new THREE.CylinderGeometry( base_radius_top, base_radius_bottom, base_height, 4, 1, false, Math.PI/4, 2*Math.PI);
    const base_material = new THREE.MeshPhongMaterial( {color: 0x808080} );
    const base = new THREE.Mesh( base_geometry, base_material );
    base.translateY(0.5 * base_height)
    base.castShadow = true
    base.receiveShadow = true
    light_group.add( base );
    light_pole_body.addShape(
        // box instead of cylinder because of cannon limitation:
        // cylinder and ball don't collide
        new CANNON.Box(new CANNON.Vec3(
            // l² + l² = r² <-> r = Math.sqrt(2*l²)
            0.5 * Math.sqrt(2 * Math.pow(base_radius_bottom, 2)),
            0.5 * base_height,
            0.5 * Math.sqrt(2 * Math.pow(base_radius_bottom, 2))
        )),
        base.position,
        base.quaternion
    )

    // lightpole pole
    const pole_geometry = new THREE.BoxGeometry( pole_width, pole_height, pole_depth );
    const pole_material = new THREE.MeshPhongMaterial( {color: 0xa0522d} );
    const pole = new THREE.Mesh( pole_geometry, pole_material );
    pole.translateY(base_height + 0.5 * pole_height)
    pole.castShadow = true
    pole.receiveShadow = true
    light_group.add( pole );
    light_pole_body.addShape(
        new CANNON.Box(new CANNON.Vec3(
            0.5 * pole_width,
            0.5 * pole_height,
            0.5 * pole_depth
        )),
        pole.position,
        pole.quaternion
    )

    // lightpole topbar
    const top_bar_geometry = new THREE.BoxGeometry( top_bar_width, top_bar_height, top_bar_depth );
    const top_bar_material = new THREE.MeshPhongMaterial( {color: 0xa0522d} );
    const top_bar = new THREE.Mesh( top_bar_geometry, top_bar_material );
    top_bar.translateX(- (0.5 * top_bar_width - 0.2))
    top_bar.translateY(0.93 * (base_height + pole_height))
    top_bar.castShadow = true
    top_bar.receiveShadow = true
    light_group.add( top_bar );
    light_pole_body.addShape(
        new CANNON.Box(new CANNON.Vec3(
            0.5 * top_bar_width,
            0.5 * top_bar_height,
            0.5 * top_bar_depth
        )),
        top_bar.position,
        top_bar.quaternion
    )

    // lightpole light_hanger
    const light_hanger_geometry = new THREE.BoxGeometry( light_hanger_width, light_hanger_height, light_hanger_depth );
    const light_hanger_material = new THREE.MeshPhongMaterial( {color: 0xa0522d} );
    const light_hanger = new THREE.Mesh( light_hanger_geometry, light_hanger_material );
    light_hanger.translateX(- (top_bar_width - 0.33))
    light_hanger.translateY(top_bar.position.y - 0.5 * (light_hanger_height + top_bar_height))
    light_hanger.castShadow = true
    light_hanger.receiveShadow = true
    light_group.add( light_hanger );
    light_pole_body.addShape(
        new CANNON.Box(new CANNON.Vec3(
            0.5 * light_hanger_width,
            0.5 * light_hanger_height,
            0.5 * light_hanger_depth
        )),
        light_hanger.position,
        light_hanger.quaternion
    )

    // lightpole light_capsule
    const light_capsule_geometry = new THREE.CylinderGeometry( light_capsule_top, light_capsule_bottom, light_capsule_height, 4, 1, false, Math.PI/4, 2*Math.PI);
    const light_capsule_material = new THREE.MeshPhongMaterial( {color: 0x2a2727} );
    const light_capsule = new THREE.Mesh( light_capsule_geometry, light_capsule_material );
    light_capsule.position.x = light_hanger.position.x
    light_capsule.position.y = light_hanger.position.y - 0.5 * (light_hanger_height + light_capsule_height)
    light_capsule.castShadow = true
    light_capsule.receiveShadow = true
    light_group.add( light_capsule );
    light_pole_body.addShape(
        // box instead of cylinder because of cannon limitation:
        // cylinder and ball don't collide
        new CANNON.Box(new CANNON.Vec3(
            0.5 * Math.sqrt(2 * Math.pow(light_capsule_bottom, 2)),
            0.5 * light_capsule_height,
            0.5 * Math.sqrt(2 * Math.pow(light_capsule_bottom, 2))
        )),
        light_capsule.position,
        light_capsule.quaternion
    )

    // lightpole light
    const light_light = new THREE.PointLight(0xffffff, 100, 100)
    light_light.castShadow = true
    const light_geometry = new THREE.CylinderGeometry( light_top, light_bottom, light_height, 4, 1, false, Math.PI/4, 2*Math.PI);
    const light_material = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0xffffee,
        roughness: 1
    });
    const light_mesh = new THREE.Mesh( light_geometry, light_material );
    light_light.position.x = light_hanger.position.x
    light_light.position.y = light_capsule.position.y - 0.5 * (light_capsule_height + light_height)
    light_light.add(light_mesh)
    light_group.add( light_light );
    light_pole_body.addShape(
        // box instead of cylinder because of cannon limitation:
        // cylinder and ball don't collide
        new CANNON.Box(new CANNON.Vec3(
            0.5 * Math.sqrt(2 * Math.pow(light_top, 2)),
            0.5 * light_height,
            0.5 * Math.sqrt(2 * Math.pow(light_top, 2))
        )),
        light_light.position,
        light_light.quaternion
    )

    return [light_group, light_pole_body]
}

