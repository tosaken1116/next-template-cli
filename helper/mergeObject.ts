export const objectMergeDeep = (target: any, source: any) => {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(
                    source[key],
                    objectMergeDeep(target[key], source[key])
                );
            }
        }
    }

    Object.assign(target, source);
    return target;
};
