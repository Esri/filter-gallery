import { Pojo } from "../../../Component";
import i18n = require("dojo/i18n!../nls/resources");

/**
 * Returns the display name for an item based on its raw, unadulturated JSON
 * @param item - raw JSON for an item, fresh from the sharing api
 */
export const getItemDisplayName = (item: Pojo) => {
    const itemType = item.type;
    const typeKeywords = item.typeKeywords || [];
    let displayName = itemType;
    // Have to use OR hardcoded strings because of i18n error on soft refresh
    if (itemType === "Feature Service" || itemType === "Feature Collection") {
        displayName = typeKeywords.indexOf("Table") > -1 ? (i18n.itemCards.itemType?.table || "Table") : (typeKeywords.indexOf("Route Layer") > -1 ? (i18n.itemCards.itemType?.routeLayer || "Route Layer") : (typeKeywords.indexOf("Markup") > -1 ? (i18n.itemCards.itemType?.markup || "Markup") : (i18n.itemCards.itemType?.featureLayer || "Feature Layer"))); 
    } else if (itemType === "Image Service") {
        displayName = typeKeywords.indexOf("Elevation 3D Layer") > -1 ? (i18n.itemCards.itemType?.elevationLayer || "Elevation Layer") : (i18n.itemCards.itemType?.imageryLayer || "Imagery Layer"); 
    } else if (itemType === "Scene Service") {
        displayName = i18n.itemCards.itemType?.sceneLayer || "Scene Layer";
    } else if (itemType === "Scene Package") {
        displayName = i18n.itemCards.itemType?.sceneLayerPackage || "Scene Layer Package";
    } else if (itemType === "Stream Service") {
        displayName = i18n.itemCards.itemType?.featureLayer || "Feature Layer";
    } else if (itemType === "Geocoding Service") {
        displayName = i18n.itemCards.itemType?.locator || "Locator";
    } else if (itemType === "Microsoft Powerpoint") {
        // Unfortunately this was named incorrectly on server side, changing it there would result
        // in some issues
        displayName = i18n.itemCards.itemType?.microsoftPowerpoint || "Microsoft PowerPoint";
    } else if (itemType === "GeoJson") {
        // Unfortunately this was named incorrectly on server side, changing it there would result
        // in some issues
        displayName = i18n.itemCards.itemType?.geoJSON || "GeoJSON";
    } else if (itemType === "Globe Service") {
        displayName = i18n.itemCards.itemType?.globeLayer || "Globe Layer";
    } else if (itemType === "Vector Tile Service") {
        displayName = i18n.itemCards.itemType?.tileLayer || "Tile Layer";
    } else if (itemType === "netCDF") {
        displayName = i18n.itemCards.itemType?.netCDF || "NetCDF";
    } else if (itemType === "Map Service") {
        if (typeKeywords.indexOf("Spatiotemporal") === -1 && (typeKeywords.indexOf("Hosted Service") > -1 || typeKeywords.indexOf("Tiled") > -1)) {
            displayName = i18n.itemCards.itemType?.tileLayer || "Tile Layer";
        } else {
            displayName = i18n.itemCards.itemType?.mapImageLayer || "Map Image Layer";
        }
    } else if (itemType && itemType.toLowerCase().indexOf("add in") > -1) {
        displayName = itemType.replace(/(add in)/ig, (i18n.itemCards.itemType?.addIn || "Add-In"));
    } else if (itemType === "datastore catalog service") {
        displayName = i18n.itemCards.itemType?.bigDataFileShare || "Big Data File Share";
    } else if (itemType === "OGCFeatureServer") {
        displayName = i18n.itemCards.itemType?.ogcFeatureLayer || "OGC Feature Layer";
    } else if (itemType === "Web Mapping Application" && typeKeywords?.includes("configurableApp")) {
        displayName = i18n.itemCards.itemType?.instantApp || "Instant App";
    }

    return displayName;
};

/**
 * Returns new item JSON containing the displayName which applies to the item
 * @param item - the item JSON to mix displayName into
 */
export const mixinItemDisplayName = (item: Pojo) => ({ ...item, displayName: getItemDisplayName(item) });
