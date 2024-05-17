import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import {sceneElements} from "../sceneElements.js";
import {open_link} from "../utils.js";
import {loadAudio} from "../myAudioLoader.js";

// ************************** //
// 1. loadButton({x: , z: }, width: , height:, offset}) - Create a button
// ************************** //
// BUTTON NAMES HAVE TO BE DIFFERENT FOR THIS TO WORK WELL

const offset = 0.1
const buttons = []
export function loadButton(width, height, position_x_z, button_color, name, callback_function) {

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
    const visible_button_material = new THREE.MeshPhongMaterial({ color: button_color });
    const visible_button_mesh = new THREE.Mesh(visible_button_geometry, visible_button_material);
    visible_button_geometry.center()
    visible_button_mesh.rotateX(- Math.PI/2)

    // invisible button for intersection
    const invisible_button_geometry = new THREE.PlaneGeometry(width, height);
    const invisible_button_material = new THREE.MeshBasicMaterial({ transparent: true , opacity: 0})
    const invisible_button_mesh = new THREE.Mesh(invisible_button_geometry, invisible_button_material);
    invisible_button_mesh.rotateX(- Math.PI/2)

    const group_visible_invisible_button = new THREE.Object3D()
    group_visible_invisible_button.add(visible_button_mesh)
    group_visible_invisible_button.add(invisible_button_mesh)
    group_visible_invisible_button.name = name
    group_visible_invisible_button.position.set(position_x_z.x, 0.01, position_x_z.z)

    const labelDiv = document.createElement("div")
    labelDiv.className = "Redirect" + name
    labelDiv.style.opacity = "0"
    const labelText = document.createElement("p")
    labelText.className = "labelRedirect"
    labelText.textContent = "Redirect"
    labelDiv.insertBefore(labelText, labelDiv.firstChild)
    const labelLink = document.createElement("a")
    labelText.appendChild(labelLink)
    const btnLabel = new CSS2DObject(labelDiv)
    btnLabel.position.set(0, 0, 0)
    group_visible_invisible_button.add(btnLabel)

    buttons.push(group_visible_invisible_button)
    sceneElements.sceneGraph.add(group_visible_invisible_button)


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

    loadAudio("sounds/mouse_click.mp3", group_visible_invisible_button)
    document.addEventListener('click', function onClick(event) {
        sceneElements.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        sceneElements.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        sceneElements.raycaster.setFromCamera( sceneElements.pointer, sceneElements.camera );
        const intersects = sceneElements.raycaster.intersectObject(group_visible_invisible_button);
        if (intersects.length > 0){
            const redirectDiv = document.querySelector(".Redirect" + name + ".hover")
            if (redirectDiv !== null){
                group_visible_invisible_button.children[group_visible_invisible_button.children.length - 1].play()
                callback_function()
            }
        }
    })

    document.addEventListener('keydown', function onCarMoving(event){
        // if car is moving then don't point and cancel hover effect
        document.body.style.cursor = "default"
        for (const element of document.querySelectorAll(".Redirect" + name + ".hover")){
            element.style.opacity = "0"
            element.classList.remove("hover")
        }
        if (event.key === 'Enter'){
            const redirectDiv = document.querySelector(".Redirect" + name + ".parked")
            if (redirectDiv !== null){
                group_visible_invisible_button.children[group_visible_invisible_button.children.length - 1].play()
                callback_function()
            }
        }
    })
}


export function intersectCarAndButtons() {
    const vehicle_group = sceneElements.sceneGraph.getObjectByName("vehicle_group")
    if (vehicle_group !== undefined && vehicle_group.children.length===5){
        for (const children of vehicle_group.children){
            sceneElements.raycaster.set(children.position, new THREE.Vector3(0, -1, 0))
            for (const button of buttons){
                const intersects = sceneElements.raycaster.intersectObject(button);
                if (intersects.length > 0){
                    const redirectDiv = document.querySelector(".Redirect" + button.name)
                    if (redirectDiv !== null){
                        redirectDiv.style.opacity = "1"
                        redirectDiv.classList.add("parked")
                    }
                    return
                } else {
                    const redirectDiv = document.querySelector(".Redirect" + button.name + ".parked")
                    if (redirectDiv !== null){
                        redirectDiv.style.opacity = "0"
                        redirectDiv.classList.remove("parked")
                    }

                }
            }
        }
    }
}