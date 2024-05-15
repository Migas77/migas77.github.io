
// ************************** //
// 1. sceneElements - To store the scene graph, and elements useful to rendering the scene
// 2. getPhysicsWorldId(visual_world_name) - visual_world_name = custom_name + physicsWorldId. Function to get the physicsWorldId from visual_world_name
// ************************** //
export const sceneElements = {
    renderer: null,
    labelRenderer: null,
    camera: null,
    sceneGraph: null,   // visual world
    animated_models: {},
    world: null,        // physics world
    raycaster: null,
    pointer: null,
    vehicle: null,
};


export function getPhysicsWorldId(visual_world_name) {
    return parseInt(visual_world_name.split("_").pop())
}