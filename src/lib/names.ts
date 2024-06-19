import {
    Config,
    colors,
    animals,
    starWars,
    uniqueNamesGenerator
} from "unique-names-generator";

export const generateUniqueName = (): string => {
    const customConfig: Config = {
        dictionaries: [colors, animals, starWars],
        separator: " ",
        style: "capital",
    };

    return uniqueNamesGenerator(customConfig);
};
