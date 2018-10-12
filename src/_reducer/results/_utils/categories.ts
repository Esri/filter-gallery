import { standardizeTree, subtreeFromPath, Tree, treeMap } from "../../../_utils";
import { ToggleOption } from "../../../components/Buttons/Toggle";

export interface CategoryTree {
    count?: number;
    categories: CategorySchema;
    description?: string;
    displayName?: string;
    title: string;
}
export type CategorySchema = CategoryTree[];

export function clearCountsRecursive(schema: ToggleOption): ToggleOption {
    return treeMap<ToggleOption>(schema, (node: ToggleOption) => {
        if (node.count) {
            delete node.count;
        }
        return node;
    });
}

export function getCategoryFromPath(schema: ToggleOption, path: string[]): ToggleOption | undefined {
    return subtreeFromPath(schema, path) as any;
}

export function mapCountsToSchema(
    aggregations: any,
    schema: ToggleOption | undefined,
    type: "categories" | "groupCategories"
): ToggleOption | undefined {
    if (!schema) {
        return;
    }
    const field = aggregations.counts.filter((f: any) => f.fieldName === type)[0];
    const categories = field.fieldValues;
    categories.forEach(({ value, count }: any) => {
        const path = value.split("/").slice(1);
        const category = getCategoryFromPath(schema, path);
        if (category) {
            category.count = count;
        }
    });
    return schema;
}

export function formatRecursive(categorySchema: CategorySchema): ToggleOption[] {
    const standardized = standardizeTree<CategoryTree, "title">(
        "categories",
        "title",
        { title: "root", categories: categorySchema }
    );

    return treeMap<ToggleOption>(standardized, (node: Tree) => {
        return {
            ...node,
            value: node.value.toLowerCase(),
            displayName: node.displayName ? node.displayName : node.value,
            tooltip: node.description ? node.description : undefined
        } as ToggleOption;
    }).children as ToggleOption[];
}