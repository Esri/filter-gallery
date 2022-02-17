import componentI18n = require("dojo/i18n!../nls/resources");

export default [
    {
        value: "maps",
        displayName: componentI18n.filters.itemType.filters.maps,
        children: [
            { value: "webMaps", displayName: componentI18n.filters.itemType.filters.webMaps },
            { value: "mapFiles", displayName: componentI18n.filters.itemType.filters.mapFiles }
        ]
    },
    {
        value: "layers",
        displayName: componentI18n.filters.itemType.filters.layers,
        children: [
            { value: "featureLayers", displayName: componentI18n.filters.itemType.filters.featureLayers },
            { value: "tileLayers", displayName: componentI18n.filters.itemType.filters.tileLayers },
            { value: "mapImageLayers", displayName: componentI18n.filters.itemType.filters.mapImageLayers },
            { value: "imageryLayers", displayName: componentI18n.filters.itemType.filters.imageryLayers },
            { value: "sceneLayers", displayName: componentI18n.filters.itemType.filters.sceneLayers },
            { value: "tables", displayName: componentI18n.filters.itemType.filters.tables }
        ]
    },
    {
        value: "scenes",
        displayName: componentI18n.filters.itemType.filters.scenes
    },
    {
        value: "apps",
        displayName: componentI18n.filters.itemType.filters.apps,
        children: [
            { value: "webApps", displayName: componentI18n.filters.itemType.filters.webApps },
            { value: "instantApps", displayName: componentI18n.filters.itemType.filters.instantApps },
            { value: "mobileApps", displayName: componentI18n.filters.itemType.filters.mobileApps },
            { value: "desktopApps", displayName: componentI18n.filters.itemType.filters.desktopApps },
            { value: "storyMaps", displayName: componentI18n.filters.itemType.filters.storyMaps }
        ]
    },
    {
        value: "tools",
        displayName: componentI18n.filters.itemType.filters.tools,
        children: [
            { value: "locators", displayName: componentI18n.filters.itemType.filters.locators },
            { value: "geodatabaseAccess", displayName: componentI18n.filters.itemType.filters.geodatabaseAccess },
            { value: "geometricOperations", displayName: componentI18n.filters.itemType.filters.geometricOperations },
            { value: "geoprocessingTasks", displayName: componentI18n.filters.itemType.filters.geoprocessingTasks },
            { value: "networkAnalysis", displayName: componentI18n.filters.itemType.filters.networkAnalysis },
            { value: "webTools", displayName: componentI18n.filters.itemType.filters.webTools }
        ]
    },
    {
        value: "files",
        displayName: componentI18n.filters.itemType.filters.files,
        children: [
            { value: "documents", displayName: componentI18n.filters.itemType.filters.documents },
            { value: "images", displayName: componentI18n.filters.itemType.filters.images },
            { value: "pdfs", displayName: componentI18n.filters.itemType.filters.pdfs }
        ]
    },
    {
        value: "notebooks",
        displayName: componentI18n.filters.itemType.filters.notebooks
    }
];
