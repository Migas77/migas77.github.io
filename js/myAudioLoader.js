import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {audioLoader, listener, loading_manager} from "./main.js";
import {sceneElements} from "./sceneElements.js";


export function loadAudio(filepath, model) {
    const sound = new THREE.PositionalAudio(listener);
    audioLoader.load(filepath, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setRefDistance( 20 );
    });
    model.add(sound)
}


export function loadAudioLoop(filepath, model) {
    const sound = new THREE.PositionalAudio(listener);
    audioLoader.load(filepath, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setRefDistance( 10 );
        sound.setLoop(true)
    });
    model.add(sound)
}

export function getAudio(filepath){
    const sound = new THREE.PositionalAudio(listener);
    audioLoader.load(filepath, function( buffer ) {
        sound.setBuffer( buffer );
        sound.setRefDistance( 5 );
    });
    return sound
}