const element_collections = new Map();

export function saveElementInCollection(collection_name, element) {
    const entry = {
        element: element,
        original_position: element.position.clone(),
        original_quaternion: element.quaternion.clone()
    }
    if (!element_collections.has(collection_name))
        element_collections.set(collection_name, [entry])
    else
        element_collections.get(collection_name).push(entry)
}

export function resetElementsInCollection(collection_name) {
    for (const entry of element_collections.get(collection_name)){
        entry.element.velocity.setZero()
        entry.element.angularVelocity.setZero()
        entry.element.quaternion.copy(entry.original_quaternion)
        entry.element.position.copy(entry.original_position)
    }
}