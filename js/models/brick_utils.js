const brick_collections =new Map();

export function saveInBrickCollection(collection_name, brick) {
    const brick_entry = {
        brick: brick,
        original_position: brick.position.clone(),
        original_quaternion: brick.quaternion.clone()
    }
    if (!brick_collections.has(collection_name))
        brick_collections.set(collection_name, [brick_entry])
    else
        brick_collections.get(collection_name).push(brick_entry)
}

export function resetBricksInCollection(collection_name) {
    for (const brick_entry of brick_collections.get(collection_name)){
        brick_entry.brick.quaternion.copy(brick_entry.original_quaternion)
        brick_entry.brick.position.copy(brick_entry.original_position)
    }
}