import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import * as THREE from "https://threejs.org/build/three.module.js";
import {sceneElements} from "../sceneElements.js";


export function loadSvg(svgLoader, filename) {
    svgLoader.load(
        filename,
        // called when the resource is loaded
        function ( data ) {
            const paths = data.paths;
            const group = new THREE.Group();
            group.scale.multiplyScalar( 0.1 );
            group.rotateX(Math.PI/2)
            group.position.y = 0.01

            for ( let i = 0; i < paths.length; i ++ ) {

                const path = paths[ i ];
                const material = new THREE.MeshBasicMaterial( {
                    color: path.color,
                    side: THREE.DoubleSide,
                    depthWrite: false
                } );

                const shapes = SVGLoader.createShapes( path );
                for ( let j = 0; j < shapes.length; j++ ) {
                    const shape = shapes[ j ];
                    const geometry = new THREE.ShapeGeometry( shape );
                    const mesh = new THREE.Mesh( geometry, material );
                    group.add( mesh );
                }
            }

            sceneElements.sceneGraph.add( group );
        },
        // called when loading is in progresses
        function ( xhr ) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

        },
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' , error);
        }
    )
}