import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {sceneElements} from "../sceneElements.js";

// ************************** //
// 1. loadButton({x: , z:, width: , height:, offset}) - Create a button
// ************************** //
export function loadButton() {

    const width = 3;
    const height = 2;
    const offset = 0.1
    const x = 0;
    const y = 0;

    const x_plus_width = x + width
    const y_plus_height = y + height
    const x_plus_offset = x + offset
    const y_plus_offset = y + offset
    const x_plus_width_minus_offset = x + width - offset
    const y_plus_height_minus_offset = y + height - offset

    const rectangleDownShape = new THREE.Shape();
    rectangleDownShape.moveTo(x, y);
    rectangleDownShape.lineTo(x_plus_offset, y_plus_offset);
    rectangleDownShape.lineTo(x_plus_width_minus_offset, y_plus_offset);
    rectangleDownShape.lineTo(x_plus_width, y);
    rectangleDownShape.lineTo(x, y);

    const rectangleLeftShape = new THREE.Shape();
    rectangleLeftShape.moveTo(x, y);
    rectangleLeftShape.lineTo(x_plus_offset, y_plus_offset)
    rectangleLeftShape.lineTo(x_plus_offset, y_plus_height_minus_offset)
    rectangleLeftShape.lineTo(x, y_plus_height)
    rectangleLeftShape.lineTo(x, y)

    const rectangleRightShape = new THREE.Shape();
    rectangleRightShape.moveTo(x_plus_width, y)
    rectangleRightShape.lineTo(x_plus_width_minus_offset, y_plus_offset)
    rectangleRightShape.lineTo(x_plus_width_minus_offset, y_plus_height_minus_offset)
    rectangleRightShape.lineTo(x_plus_width, y_plus_height)
    rectangleRightShape.lineTo(x_plus_width, y)

    const rectangleUpShape = new THREE.Shape();
    rectangleUpShape.moveTo(x_plus_width, y_plus_height)
    rectangleUpShape.lineTo(x_plus_width_minus_offset, y_plus_height_minus_offset)
    rectangleUpShape.lineTo(x_plus_offset, y_plus_height_minus_offset)
    rectangleUpShape.lineTo(x, y_plus_height)
    rectangleUpShape.lineTo(x_plus_width, y_plus_height)
    

    // visible button which is just a border, so it can't be used for intersection
    const visible_button_geometry = new THREE.ShapeGeometry([rectangleDownShape, rectangleLeftShape, rectangleRightShape, rectangleUpShape]);
    const visible_button_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const visible_button_mesh = new THREE.Mesh(visible_button_geometry, visible_button_material);
    visible_button_geometry.center()
    visible_button_mesh.rotateX(- Math.PI/2)
    visible_button_mesh.position.y = 0.01

    // invisible button for intersection
    const invisible_button_geometry = new THREE.PlaneGeometry(width, height);
    const invisible_button_material = new THREE.MeshBasicMaterial({ transparent: true , opacity: 0})
    const invisible_button_mesh = new THREE.Mesh(invisible_button_geometry, invisible_button_material);
    invisible_button_mesh.rotateX(- Math.PI/2)
    invisible_button_mesh.position.y = 0.01

    const group_visible_invisible_button = new THREE.Object3D()
    group_visible_invisible_button.add(visible_button_mesh)
    group_visible_invisible_button.add(invisible_button_mesh)
    group_visible_invisible_button.name = "button"

    sceneElements.sceneGraph.add(group_visible_invisible_button)
}