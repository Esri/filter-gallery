import * as componentI18n from "dojo/i18n!../nls/resources";

export default [
    {
        value: "maps",
        displayName: componentI18n.filters.maps,
        children: [
            { value: "webMaps", displayName: componentI18n.filters.webMaps },
            { value: "mapFiles", displayName: componentI18n.filters.mapFiles }
        ]
    },
    {
        value: "layers",
        displayName: componentI18n.filters.layers,
        children: [
            { value: "featureLayers", displayName: componentI18n.filters.featureLayers },
            { value: "tileLayers", displayName: componentI18n.filters.tileLayers },
            { value: "mapImageLayers", displayName: componentI18n.filters.mapImageLayers },
            { value: "imageryLayers", displayName: componentI18n.filters.imageryLayers },
            { value: "sceneLayers", displayName: componentI18n.filters.sceneLayers },
            { value: "tables", displayName: componentI18n.filters.tables }
        ]
    },
    {
        value: "scenes",
        displayName: componentI18n.filters.scenes
    },
    {
        value: "apps",
        displayName: componentI18n.filters.apps,
        children: [
            { value: "webApps", displayName: componentI18n.filters.webApps },
            { value: "mobileApps", displayName: componentI18n.filters.mobileApps },
            { value: "desktopApps", displayName: componentI18n.filters.desktopApps }
        ]
    },
    {
        value: "tools",
        displayName: componentI18n.filters.tools,
        children: [
            { value: "locators", displayName: componentI18n.filters.locators },
            { value: "geodatabaseAccess", displayName: componentI18n.filters.geodatabaseAccess },
            { value: "geometricOperations", displayName: componentI18n.filters.geometricOperations },
            { value: "geoprocessingTasks", displayName: componentI18n.filters.geoprocessingTasks },
            { value: "networkAnalysis", displayName: componentI18n.filters.networkAnalysis },
            { value: "webTools", displayName: componentI18n.filters.webTools }
        ]
    },
    {
        value: "files",
        displayName: componentI18n.filters.files,
        children: [
            { value: "documents", displayName: componentI18n.filters.documents },
            { value: "images", displayName: componentI18n.filters.images },
            { value: "pdfs", displayName: componentI18n.filters.pdfs }
        ]
    },
    {
        value: "notebooks",
        displayName: componentI18n.filters.notebooks
    }
];
