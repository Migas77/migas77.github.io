import * as THREE from "https://threejs.org/build/three.module.js";
import {sceneElements} from "../sceneElements.js";

const textureLoader = new THREE.TextureLoader();
/*
filename: string
position: {x: 0, y: 0, z:0}
rotation_y: 0
*/
export function loadImage(filepath, side_x, side_y, position, rotation_x) {
    const image = getImage(filepath, side_x, side_y, position, rotation_x)
    sceneElements.sceneGraph.add(image)
}

export function getImage(filepath, side_x, side_y, position, rotation_x) {
    const planeGeometry = new THREE.PlaneGeometry(side_x, side_y);
    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(filepath),
        transparent: true
    });
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(position.x, position.y, position.z)
    plane.rotateX(rotation_x)
    return plane
}