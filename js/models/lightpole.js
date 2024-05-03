import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {sceneElements} from "../sceneElements.js";

export function loadLightPole() {
    loadLightPoleAtOrigin(
        0.3, 0.6, 1,
        0.2, 3.4, 0.2,
        1.4, 0.15, 0.15,
        0.06, 0.3, 0.06,
        0.18, 0.24, 0.16,
        0.24, 0.18, 0.4,
    )
}

function loadLightPoleAtOrigin(
    base_radius_top, base_radius_bottom, base_height,
    pole_width, pole_height, pole_depth,
    top_bar_width, top_bar_height, top_bar_depth,
    light_hanger_width, light_hanger_height, light_hanger_depth,
    light_capsule_top, light_capsule_bottom, light_capsule_height,
    light_top, light_bottom, light_height,
) {
    // lightpole base
    const base_geometry = new THREE.CylinderGeometry( base_radius_top, base_radius_bottom, base_height, 4, 1, false, Math.PI/4, 2*Math.PI);
    const base_material = new THREE.MeshPhongMaterial( {color: 0x808080} );
    const base = new THREE.Mesh( base_geometry, base_material );
    base.translateY(0.5 * base_height)
    base.castShadow = true
    base.receiveShadow = true
    sceneElements.sceneGraph.add( base );

    // lightpole pole
    const pole_geometry = new THREE.BoxGeometry( pole_width, pole_height, pole_depth );
    const pole_material = new THREE.MeshPhongMaterial( {color: 0xa0522d} );
    const pole = new THREE.Mesh( pole_geometry, pole_material );
    pole.translateY(base_height + 0.5 * pole_height)
    pole.castShadow = true
    pole.receiveShadow = true
    sceneElements.sceneGraph.add( pole );

    // lightpole topbar
    const top_bar_geometry = new THREE.BoxGeometry( top_bar_width, top_bar_height, top_bar_depth );
    const top_bar_material = new THREE.MeshPhongMaterial( {color: 0xa0522d} );
    const top_bar = new THREE.Mesh( top_bar_geometry, top_bar_material );
    top_bar.translateX(- (0.5 * top_bar_width - 0.2))
    top_bar.translateY(0.93 * (base_height + pole_height))
    top_bar.castShadow = true
    top_bar.receiveShadow = true
    sceneElements.sceneGraph.add( top_bar );

    // lightpole light_hanger
    const light_hanger_geometry = new THREE.BoxGeometry( light_hanger_width, light_hanger_height, light_hanger_depth );
    const light_hanger_material = new THREE.MeshPhongMaterial( {color: 0xa0522d} );
    const light_hanger = new THREE.Mesh( light_hanger_geometry, light_hanger_material );
    light_hanger.translateX(- (top_bar_width - 0.33))
    light_hanger.translateY(top_bar.position.y - 0.5 * (light_hanger_height + top_bar_height))
    light_hanger.castShadow = true
    light_hanger.receiveShadow = true
    sceneElements.sceneGraph.add( light_hanger );

    // lightpole light_capsule
    const light_capsule_geometry = new THREE.CylinderGeometry( light_capsule_top, light_capsule_bottom, light_capsule_height, 4, 1, false, Math.PI/4, 2*Math.PI);
    const light_capsule_material = new THREE.MeshPhongMaterial( {color: 0x2a2727} );
    const light_capsule = new THREE.Mesh( light_capsule_geometry, light_capsule_material );
    light_capsule.position.x = light_hanger.position.x
    light_capsule.position.y = light_hanger.position.y - 0.5 * (light_hanger_height + light_capsule_height)
    light_capsule.castShadow = true
    light_capsule.receiveShadow = true
    sceneElements.sceneGraph.add( light_capsule );

    // lightpole light
    const light_light = new THREE.PointLight(0xffffff, 50, 12)
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
    sceneElements.sceneGraph.add( light_light );


}

