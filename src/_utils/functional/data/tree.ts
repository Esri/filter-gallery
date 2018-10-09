/**
 * A simple, general purpose tree interface
 */
export interface Tree {
    value: string;
    children?: Tree[];
    [propName: string]: any;
}

/**
 * Performs a depth-first search against a simple tree for a node having a specified value
 * @param tree - Tree to perform the depth-first search against
 * @param value - Matching value for the search
 */
export function treeDfs(tree: Tree, value: string) {
    return genericDfs<Tree, "value">("children", "value", tree, value);
}

/**
 * Performs a breadth-first search against a simple tree for a node having a specified value
 * @param tree - Tree to perform the breadth-first search against
 * @param value - Matching value for the search
 */
export function treeBfs(tree: Tree, value: string) {
    return genericBfs<Tree, "value">("children", "value", tree, value);
}

/**
 * Returns a node from a simple tree matching a provided path from the root
 * @param tree - Tree to return the node from
 * @param path - Path to the target node
 */
export function subtreeFromPath(tree: Tree, path: string[]) {
    return genericSubtreeFromPath<Tree, "value">("children", "value", tree, path);
}

/**
 * Returns a new simple tree with only nodes matching the included values
 * @param tree - Tree to prune
 * @param include - Included values
 */
export function treePrune(tree: Tree, include: string[]) {
    return genericPrune<Tree, "value">("children", "value", tree, include);
}

/**
 * Returns a new compressed a tree, with any nodes that had both children and no siblings replaced with their children
 * @param tree 
 */
export function treeCompress(tree: Tree) {
    return genericCompress<Tree>("children", tree);
}

/**
 * Returns a new tree resulting from mapping the current tree to a new type (depth-first)
 * @param tree - The tree to iterate over
 * @param fn - Function returning nodes of new type
 */
export function treeMap<T>(tree: Tree, fn: (node?: Tree) => T) {
    return genericTreeMap<Tree, T>("children", tree, fn);
}

/**
 * Performs an operation for each node in the provided tree (depth-first)
 * @param tree - The tree to iterate over
 * @param fn - Operation to perform for each node
 */
export function treeForEach(tree: Tree, fn: (node?: Tree) => any) {
    return genericTreeForEach<Tree>("children", tree, fn);
}

/**
 * Performs a depth-first-search against a tree, returning the matching subtree if identified
 * @param childProp - Property on the tree containing potential child nodes
 * @param valueProp - Property on the tree to compare for match
 * @param tree - Tree to perform a depth first search against
 * @param value - Matching value to search for
 */
export function genericDfs<T, K extends keyof T>(childProp: keyof T, valueProp: K, tree: T, value: T[K]): T | undefined {
    const children = tree[childProp] as any as T[];
    if (tree[valueProp] === value) {
        return tree;
    } else if (!children) {
        return;
    }
    return children.reduce((result: T | undefined, current: T) => {
        if (!!result) {
            return result;
        }
        return genericDfs(childProp, valueProp, current, value);
    }, undefined);
}

/**
 * Performs a breadth-first-search against a tree, returning the matching subtree if identified
 * @param childProp - Property on the tree containing potential child nodes
 * @param valueProp - Property on the tree to compare for match
 * @param tree - Tree to perform a depth first search against
 * @param value - Matching value to search for
 */
export function genericBfs<T, K extends keyof T>(childProp: keyof T, valueProp: K, tree: T, value: T[K]): T | undefined {
    let queue: T[] = [tree];
    return visitNodes();
    
    function visitNodes(): T | undefined {
        const next = queue.shift();
        if (!next) {
            return;
        } else if (next[valueProp] === value) {
            return next;
        }
        enqueueChildNodes(next);
        return visitNodes();
    }
    
    function enqueueChildNodes(node: T) {
        const children = node[childProp] as any as T[];
        if (!!children) {
            queue = queue.concat(children);
        }
    }
}

/**
 * Returns a subtree matching a specified path (array of values) if available
 * @param childProp - Property on the tree containing potential child nodes
 * @param valueProp - Property on the tree containing the node's identifying value
 * @param tree - Tree to return subtree from
 * @param path - Path to the desired subtree expressed as an array of child values from the root node
 */
export function genericSubtreeFromPath<T, K extends keyof T>(childProp: keyof T, valueProp: K, tree: T, path: T[K][]): T | undefined {
    const children = tree[childProp] as any as T[];
    if (!children) {
        return undefined;
    }
    return children.reduce((result: T | undefined, current: T) => {
        if (current[valueProp] === path[0]) {
            if (path.length === 1) {
                return current;
            }
            return genericSubtreeFromPath(childProp, valueProp, current, path.slice(1));
        }
        return result;
    }, undefined);
}

/**
 * Returns a pruned copy of the provided tree based on an array of included values.
 * The resulting tree will only contain nodes with values matching those provided.
 * @param childProp - Property on the tree containing potential child nodes
 * @param valueProp - Property on the tree containing the node's identifying value
 * @param tree - Tree to return subtree from
 * @param include - Array of values to include in the pruned tree
 */
export function genericPrune<T, K extends keyof T>(childProp: keyof T, valueProp: K, tree: T, include: T[K][]): T {
    const t = tree as any;
    const children = tree[childProp] as any as T[];
    if (!children || children.length === 0) {
        return {
            ...t
        };
    }
    return {
        ...t,
        [childProp]: children.reduce((result: T[], current: T) => {
            if (include.indexOf(current[valueProp]) !== -1) {
                result.push(genericPrune(childProp, valueProp, current, include));
            }
            return result;
        }, [])
    };
}

/**
 * Returns a new tree, replacing any nodes that had both children and no siblings with their children.
 * @param childProp - Property on the tree containing potential child nodes
 * @param tree - The tree to compress
 */
export function genericCompress<T>(childProp: keyof T, tree: T): T {
    const t = tree as any;
    const children = tree[childProp] as any as T[];
    if (!children) {
        return tree;
    }
    return {
        ...t,
        [childProp]: omitSingle(children)
    };

    function omitSingle(ch: T[]): T[] {
        if (ch.length === 0) {
            return [];
        } else if (ch.length === 1 && !ch[0][childProp]) {
            return ch;
        } else if (ch.length > 1) {
            return ch.reduce((result: T[], current: T): T[] => {
                if (!current[childProp]) {
                    result.push(current);
                    return result;
                }
                const curr = current as any;
                result.push({
                    ...curr,
                    [childProp]: omitSingle(curr[childProp])
                });
                return result;
            }, []);
        }
        return omitSingle(ch[0][childProp] as any as T[]);
    }
}

/**
 * Iterates over a tree (depth-first), performing a specified operation for each node
 * @param childProp - Property on the tree containing potential child nodes
 * @param tree - The tree to iterate over
 * @param fn - Function to execute for each node
 */
export function genericTreeForEach<T>(
    childProp: keyof T,
    tree: T,
    fn: (currentNode?: T) => any
) {
    const children = tree[childProp] as any;
    if (children) {
        children.forEach((node: T) => genericTreeForEach(childProp, node, fn));
    }
    fn(tree);
}

/**
 * Iterates over a tree (depth-first), performing a specified operation on each node to yield a new node in its place
 * @param childProp - Property on the tree containing potential child nodes
 * @param tree - The tree to iterate over
 * @param fn - Function returning the new node
 */
export function genericTreeMap<T, K>(
    childProp: keyof T,
    tree: T,
    fn: (currentNode?: T) => K
): K {
    const t = tree as any;
    return fn({
        ...t,
        [childProp]: t[childProp] ?
            t[childProp].map((node: T) => genericTreeMap(childProp, node, fn)) :
            undefined
    });
}

/**
 * Returns a new simple Tree based on an input tree of different interface
 * @param childProp - Property on the input tree containing an array of subtrees
 * @param valueProp - Identifier property on the input tree
 * @param tree - The input tree to standardize
 */
export function standardizeTree<T, K extends keyof T>(childProp: keyof T, valueProp: K, tree: T): Tree {
    return genericTreeMap<T, Tree>(
        childProp,
        tree,
        (node: T) => {
            const t = node as any;
            const value = node[valueProp];
            delete node[valueProp];
            if (node[childProp]) {
                const children = node[childProp];
                delete node[childProp];
                return {
                    ...t,
                    value,
                    children
                };
            }
            return {
                ...t,
                value
            };
        }
    );
}
