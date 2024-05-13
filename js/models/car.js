import * as THREE from "https://threejs.org/build/three.module.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/+esm'
import {getPhysicsWorldId, sceneElements} from "../sceneElements.js";

// ************************** //
// 1. loadCar(gltfLoader) - Load, add to the scene and world the Car Model at the position (0, 0, 0) facing the negative z axis
// ************************** //
export function loadCar(gltfLoader) {
    const vehicleGroup = new THREE.Group()
    vehicleGroup.name = "vehicle_group"
    const frontX = -0.40;    // same for both wheels at the front
    const frontY = 0.02;     // same for both wheels at the front
    const frontZ =  0.30;    // symetric for both wheels at the front
    const backX = 0.45;    // same for both wheels at the back
    const backY = 0.02;   // same for both wheels at the back
    const backZ = 0.27;    // symetric for both wheels at the back
    const scaleFactor = 0.01

    // Build the car chassis
    const chassisShape = new CANNON.Box(new CANNON.Vec3(0.71, 0.20, 0.4))
    const chassisBody = new CANNON.Body({ mass: 100 })
    chassisBody.position.set(0, 4, -5)
    chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI/2)
    chassisBody.addShape(chassisShape)

    // Create the vehicle
    const vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
    })

    const wheelOptions = {
        radius: 0,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        maxSuspensionTravel: 0.3,
        frictionSlip: 1.4,
        dampingRelaxation: 2.3,
        dampingCompression: 4.4,
        maxSuspensionForce: 100000,
        rollInfluence: 0.01,
        axleLocal: new CANNON.Vec3(0, 0, 1),
        chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,
    }

    let chassisVisual;
    // chassis
    gltfLoader.load( "rocket_league_octane_chassis.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.name = "chassis_2"
        chassisVisual = gltf.scene
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        vehicleGroup.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Error loading model chassis: ${error}`);
    } );

    // front right
    gltfLoader.load( "rocket_league_octane_wheel_fl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(frontX)
        gltf.scene.translateZ(-frontZ)
        gltf.scene.name = "wheel_3"
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        vehicleGroup.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Front Right Wheel - Error loading model rocket_league_octane_wheel_fl.glb:\n${error}`);
    } );
    wheelOptions.radius = 0.124
    wheelOptions.suspensionRestLength = 0.48
    wheelOptions.chassisConnectionPointLocal.set(frontX, frontY, -frontZ)
    vehicle.addWheel(wheelOptions)

    // front left
    gltfLoader.load( "rocket_league_octane_wheel_fl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(frontX)
        gltf.scene.translateZ(frontZ)
        gltf.scene.rotateY(Math.PI)
        gltf.scene.name = "wheel_4"
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        vehicleGroup.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Front Left Wheel - Error loading model rocket_league_octane_wheel_fl.glb:\n${error}`);
    } );
    wheelOptions.chassisConnectionPointLocal.set(frontX , frontY, frontZ)
    vehicle.addWheel(wheelOptions)

    // back right
    gltfLoader.load( "rocket_league_octane_wheel_bl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(backX)
        gltf.scene.translateZ(-backZ)
        gltf.scene.name = "wheel_5"
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        vehicleGroup.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Back Right Wheel - Error loading model rocket_league_octane_wheel_bl.glb:\n${error}`);
    } );
    wheelOptions.radius = 0.142
    wheelOptions.suspensionRestLength = 0.45
    wheelOptions.chassisConnectionPointLocal.set(backX, backY, -backZ)
    vehicle.addWheel(wheelOptions)

    // back left
    gltfLoader.load( "rocket_league_octane_wheel_bl.glb", function ( gltf ) {
        gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
        gltf.scene.translateX(backX)
        gltf.scene.translateZ(backZ)
        gltf.scene.rotateY(Math.PI)
        gltf.scene.name = "wheel_6"
        gltf.scene.traverse(function (node) {
            if (node.isMesh){
                node.castShadow = true
                node.receiveShadow = true
            }
        })
        vehicleGroup.add(gltf.scene)
    }, undefined, function ( error ) {
        console.error( `Back Left Wheel - Error loading model rocket_league_octane_wheel_bl.glb:\n${error}`);
    } );
    wheelOptions.chassisConnectionPointLocal.set(backX, backY, backZ)
    vehicle.addWheel(wheelOptions)

    vehicle.addToWorld(sceneElements.world)
    sceneElements.vehicle = vehicle
    sceneElements.sceneGraph.add(vehicleGroup)

    // Add the wheel bodies
    const wheelBodies = []
    const wheelMaterial = new CANNON.Material('wheel')
    vehicle.wheelInfos.forEach((wheel, i) => {
        // isBack ? backValue : frontValue
        const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, i + 3 < 5 ? 0.11 : 0.11, 20)
        const wheelBody = new CANNON.Body({
            mass: 0,
            material: wheelMaterial,
        })
        wheelBody.type = CANNON.Body.KINEMATIC
        wheelBody.collisionFilterGroup = 0 // turn off collisions
        const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
        wheelBodies.push(wheelBody)
        sceneElements.world.addBody(wheelBody)
    })

    // Define interactions between wheels and ground
    const groundMaterial = sceneElements.world.bodies[getPhysicsWorldId("ground_0")].material
    const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
        friction: 0.3,
        restitution: 0,
        contactEquationStiffness: 1000,
    })
    sceneElements.world.addContactMaterial(wheel_ground)

    // shadow


    // Update the wheel bodies + car
    sceneElements.world.addEventListener('postStep', () => {
        if (chassisVisual!=undefined){
            chassisVisual.position.copy({x: chassisBody.position.x + 0.055, y: chassisBody.position.y - 0.49, z: chassisBody.position.z})
            chassisVisual.quaternion.copy(chassisBody.quaternion)

            // update wheels
            for (let i = 0; i < vehicle.wheelInfos.length; i++) {
                vehicle.updateWheelTransform(i)
                const transform = vehicle.wheelInfos[i].worldTransform
                const transform_position = transform.position
                const wheelBody = wheelBodies[i]
                wheelBody.position.copy(transform.position)
                wheelBody.quaternion.copy(transform.quaternion)
                const wheelVisual = sceneElements.sceneGraph.getObjectByName("wheel_" + (3 + i))
                if (wheelVisual != undefined){
                    wheelVisual.position.copy(transform.position)

                    if (i + 3 == 4 || i + 3 == 6){
                        // if they are right wheels we need to flip them
                        const flip_y = new CANNON.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
                        wheelVisual.quaternion.copy(flip_y.mult(transform.quaternion))
                    } else {
                        wheelVisual.quaternion.copy(transform.quaternion)
                    }
                }
            }
        }
    })
}