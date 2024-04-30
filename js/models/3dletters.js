import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {sceneElements} from "../sceneElements.js";
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

// ************************** //
// 1. loadNameText(fontLoader) - Load, add to the scene and world the 3D representation of my name at the position (0, 0, 0)
// ************************** //
export function loadNameText(fontLoader) {

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

        const letter_mass = 10

        const models = [
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.46, 0.5, 0.1))
                }),
                "letter": "M",
                "x": 0,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "I",
                "x": 1,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "G",
                "x": 2,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "U",
                "x": 3,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "E",
                "x": 4,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "L",
                "x": 5,
            },
            {
                "body": null,
                "letter": " ",
                "x": null,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "F",
                "x": 7,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "I",
                "x": 8,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "G",
                "x": 9,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "U",
                "x": 10,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "E",
                "x": 11,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "I",
                "x": 12,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "R",
                "x": 13,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "E",
                "x": 14,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "D",
                "x": 15,
            },
            {
                "body": new CANNON.Body({
                    mass: letter_mass,
                    shape: new CANNON.Box(new CANNON.Vec3(0.1, 0.1, 0.1))
                }),
                "letter": "O",
                "x": 16,
            }
        ]

        for (let index = 0; index < models.length; index++) {
            let dict = models[index]
            let textBody = dict.body
            if (textBody == null)
                continue
            if (dict.letter != 'M')
                continue


            const textGeometry = new TextGeometry( dict.letter,  textOptions);
            const textMesh = new THREE.Mesh( textGeometry, materials );
            textMesh.scale.set(0.01, 0.01, 0.01)
            textMesh.name = "name"
            const center = new THREE.Vector3()
            textGeometry.center()
            textMesh.translateY(0.49)
            textBody.position.set(0,1,0)
            sceneElements.world.addBody(textBody)
            sceneElements.sceneGraph.add(textMesh)

            // Link visual and physics world
            /* sceneElements.world.addEventListener('postStep', () => {
                if (textMesh != undefined){
                    textMesh.position.copy(textBody.position)
                    textMesh.quaternion.copy(textBody.quaternion)
                }
            }) */
        }


    }, undefined, function ( error ) {
        console.error( `Error Loading Font:\n${error}`);
    } );
}