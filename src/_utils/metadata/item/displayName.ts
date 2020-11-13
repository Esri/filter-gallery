import { Pojo } from "../../../Component";

/**
 * Returns the display name for an item based on its raw, unadulturated JSON
 * @param item - raw JSON for an item, fresh from the sharing api
 */
export const getItemDisplayName = (item: Pojo) => {
    const itemType = item.type;
    const typeKeywords = item.typeKeywords || [];
    let displayName = itemType;

    if (itemType === "Feature Service" || itemType === "Feature Collection") {
        displayName = typeKeywords.indexOf("Table") > -1 ? "Table" : (typeKeywords.indexOf("Route Layer") > -1 ? "Route Layer" : (typeKeywords.indexOf("Markup") > -1 ? "Markup" : "Feature Layer"));
    } else if (itemType === "Image Service") {
        displayName = typeKeywords.indexOf("Elevation 3D Layer") > -1 ? "Elevation Layer" : "Imagery Layer";
    } else if (itemType === "Scene Service") {
        displayName = "Scene Layer";
    } else if (itemType === "Scene Package") {
        displayName = "Scene Layer Package";
    } else if (itemType === "Stream Service") {
        displayName = "Feature Layer";
    } else if (itemType === "Geocoding Service") {
        displayName = "Locator";
    } else if (itemType === "Microsoft Powerpoint") {
        // Unfortunately this was named incorrectly on server side, changing it there would result
        // in some issues
        displayName = "Microsoft PowerPoint";
    } else if (itemType === "GeoJson") {
        // Unfortunately this was named incorrectly on server side, changing it there would result
        // in some issues
        displayName = "GeoJSON";
    } else if (itemType === "Globe Service") {
        displayName = "Globe Layer";
    } else if (itemType === "Vector Tile Service") {
        displayName = "Tile Layer";
    } else if (itemType === "netCDF") {
        displayName = "NetCDF";
    } else if (itemType === "Map Service") {
        if (typeKeywords.indexOf("Spatiotemporal") === -1 && (typeKeywords.indexOf("Hosted Service") > -1 || typeKeywords.indexOf("Tiled") > -1)) {
            displayName = "Tile Layer";
        } else {
            displayName = "Map Image Layer";
        }
    } else if (itemType && itemType.toLowerCase().indexOf("add in") > -1) {
        displayName = itemType.replace(/(add in)/ig, "Add-In");
    } else if (itemType === "datastore catalog service") {
        displayName = "Big Data File Share";
    }

    return displayName;
};

/**
 * Returns new item JSON containing the displayName which applies to the item
 * @param item - the item JSON to mix displayName into
 */
export const mixinItemDisplayName = (item: Pojo) => ({ ...item, displayName: getItemDisplayName(item) });
