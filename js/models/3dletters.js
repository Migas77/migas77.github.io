import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {sceneElements} from "../sceneElements.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import {fontLoader} from "../main.js";
import {brick_audio_names} from "./brick.js";
import {getAudio} from "../myAudioLoader.js";

// ************************** //
// 1. loadNameText(fontLoader) - Load, add to the scene and world the 3D representation of my name at the position (0, 0, 0)
// ************************** //
export function loadNameText(position_x_z) {

    fontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        const materials = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];

        const textOptions = {
            font: font,
            size: 80,
            depth: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5
        }


        const models = [
            getLetterDict(0.461, 0.49, 0.13, "M", 0),
            getLetterDict(0.135, 0.49, 0.13, "I", 1),
            getLetterDict(0.447, 0.51, 0.13, "G", 2),
            getLetterDict(0.4, 0.50, 0.13, "U", 3),
            getLetterDict(0.38, 0.49, 0.13, "E", 4),
            getLetterDict(0.34, 0.49, 0.13, "L", 5),
            getLetterDict(0.46, 0.49, 0.13, "", 6),
            getLetterDict(0.36, 0.49, 0.13, "F", 6),
            getLetterDict(0.135, 0.49, 0.13, "I", 7),
            getLetterDict(0.447, 0.51, 0.13, "G", 8),
            getLetterDict(0.4, 0.50, 0.13, "U", 9),
            getLetterDict(0.38, 0.49, 0.13, "E", 10),
            getLetterDict(0.135, 0.49, 0.13, "I", 11),
            getLetterDict(0.40, 0.49, 0.13, "R", 12),
            getLetterDict(0.38, 0.49, 0.13, "E", 13),
            getLetterDict(0.41, 0.49, 0.13, "D", 14),
            getLetterDict(0.46, 0.51, 0.13, "O", 15),
        ]

        for (let index = 0; index < models.length; index++) {
            let dict = models[index]
            let textBody = dict.body
            let letter = dict.letter
            if (letter === "")
                continue


            const textGeometry = new TextGeometry( letter,  textOptions);
            const textMesh = new THREE.Mesh( textGeometry, materials );
            textMesh.scale.set(0.01, 0.01, 0.01)
            textMesh.name = "name"
            textGeometry.center()
            textMesh.translateY(0.49)
            textMesh.receiveShadow = true
            textMesh.castShadow = true
            textBody.position.set(position_x_z.x + dict.x,0.49,position_x_z.z)
            brick_audio_names.forEach((brick_audio_name) => textMesh.add(getAudio(brick_audio_name)))
            sceneElements.world.addBody(textBody)
            sceneElements.sceneGraph.add(textMesh)

            // Link visual and physics world
            sceneElements.world.addEventListener('postStep', () => {
                if (textMesh != undefined){
                    textMesh.position.copy(textBody.position)
                    textMesh.quaternion.copy(textBody.quaternion)
                }
            })

            textBody.addEventListener("collide", function (event) {
                if (event.body === sceneElements.world.bodies[0] && event.contact.getImpactVelocityAlongNormal() > 0.1){
                    // play randomly one of the hit sounds
                    console.log(event.contact.getImpactVelocityAlongNormal())
                    const audios = textMesh.children
                    if (audios.every(audio => !audio.isPlaying)){
                        // if there isn't an audio playing for this object
                        const random_index = Math.floor(Math.random() * audios.length)
                        audios[random_index].play()
                    }
                }
            })
        }


    }, undefined, function ( error ) {
        console.error( `Error Loading Font:\n${error}`);
    } );
}

const letter_mass = 0.1
function getLetterDict(hitbox_x, hitbox_y, hitbox_z, letter, position_x) {
    return {
        "body": new CANNON.Body({
            mass: letter_mass,
            shape: new CANNON.Box(new CANNON.Vec3(hitbox_x, hitbox_y, hitbox_z))
        }),
        "letter": letter,
        "x": position_x,
    }
}