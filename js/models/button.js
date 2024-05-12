import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import {sceneElements} from "../sceneElements.js";

// ************************** //
// 1. loadButton({x: , z: }, width: , height:, offset}) - Create a button
// ************************** //

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
const buttons = []
export function loadButton(position_x_z, name, url_to_open) {

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
    group_visible_invisible_button.name = name
    group_visible_invisible_button.position.set(position_x_z.x, 0.01, position_x_z.z)

    const labelDiv = document.createElement("div")
    labelDiv.className = "Redirect" + name
    const labelText = document.createElement("p")
    labelText.className = "labelRedirect"
    labelText.textContent = "Redirect"
    labelDiv.insertBefore(labelText, labelDiv.firstChild)
    const btnLabel = new CSS2DObject(labelDiv)
    btnLabel.position.set(0, 0, 0)
    group_visible_invisible_button.add(btnLabel)


    document.addEventListener('pointermove', function onPointerMove( event ) {
        sceneElements.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        sceneElements.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        sceneElements.raycaster.setFromCamera( sceneElements.pointer, sceneElements.camera );

        const intersects = sceneElements.raycaster.intersectObject(group_visible_invisible_button);
        if (intersects.length > 0){
            document.body.style.cursor = "pointer"
            const redirectDiv = document.querySelector(".Redirect" + name)
            if (redirectDiv !== null){
                redirectDiv.style.opacity = "1"
                redirectDiv.classList.add("hover")
            }
        } else {
            if (document.querySelectorAll(".hover").length === 0){
                // can't be intersecting other buttons
                document.body.style.cursor = "default"
            }
            const redirectDiv = document.querySelector(".Redirect" + name)
            if (redirectDiv !== null){
                redirectDiv.style.opacity = "0"
                redirectDiv.classList.remove("hover")
            }

        }
    })

    document.addEventListener('click', function onClick(event) {
        sceneElements.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        sceneElements.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        sceneElements.raycaster.setFromCamera( sceneElements.pointer, sceneElements.camera );
        const intersects = sceneElements.raycaster.intersectObject(group_visible_invisible_button);
        if (intersects.length > 0){
            const redirectDiv = document.querySelector(".Redirect" + name)
            if (redirectDiv !== undefined){
                window.open(url_to_open)
            }
        }
    })

    buttons.push(group_visible_invisible_button)
    sceneElements.sceneGraph.add(group_visible_invisible_button)
}


const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshPhongMaterial({ color: 'rgb(255,0,0)' });
const cubeObject = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeObject.position.set(1.5, 0.5, 1.5)
var bool = true
export function intersectCarAndButtons() {

    if (bool){
        sceneElements.sceneGraph.add(cubeObject)
        bool = false
        for (const button of buttons){
            console.log("button.position", button.position)
        }
    }

    const chassis = sceneElements.sceneGraph.getObjectByName("chassis_2")
    if (chassis !== undefined){
        sceneElements.raycaster.set(cubeObject.position, new THREE.Vector3(0, 1, 0))
        for (const button of buttons){
            const intersects = sceneElements.raycaster.intersectObject(button);
            if (intersects.length > 0){
                console.log("intersects")
                const redirectDiv = document.querySelector(".Redirect" + name)
                if (redirectDiv !== null){
                    redirectDiv.style.opacity = "1"
                    redirectDiv.classList.add("hover")
                }
            } else {
                const redirectDiv = document.querySelector(".Redirect" + name)
                if (redirectDiv !== null){
                    redirectDiv.style.opacity = "0"
                    redirectDiv.classList.remove("hover")
                }

            }
        }
    }
}