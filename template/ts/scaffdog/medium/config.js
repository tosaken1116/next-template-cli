export default {
    files: ["*"],
    helpers: [
        (registry) => {
            registry.set("include", (context, array, value) =>
                array.includes(value)
            );
        },
    ],
};
