import * as tagsI18n from "dojo/i18n!./nls/resources";
import { Component, H } from "../../Component";

import AccordionDropdown from "../Dropdowns/AccordionDropdown";
import CheckToggle from "../Buttons/CheckToggle";

/**
 * An option for the `TagsFilter` component.
 * @type {object}
 */
export interface TagOption { value: string; count: number; }

export interface TagsFilterProps {
    /**
     * Array of available tags for the component.
     * @type {object}
     */
    availableTags: TagOption[];

    /**
     * The current filter string for tag options.
     * @type {string}
     */
    filterString: string;

    /**
     * A unique key for the `TagsFilter` component.
     * @type {string}
     */
    key: string;

    /**
     * Handler for when the filter string is changed.
     * @type {function}
     */
    onFilterStringChange: (tagName: string) => void;

    /**
     * Handler for when a tag is selected in the filter.
     * @type {function}
     */
    onTagSelect: (tags?: { [tagName: string]: boolean }) => void;

    /**
     * The current selection of the `TagsFilter`.
     * @type {object}
     */
    tagsFilter: { [tagName: string]: boolean } | undefined;

    /**
     * Optional title to use for the `TagsFilter` accordion.
     * @type {string}
     */
    title?: string;

    /**
     * If this option is enabled the filter will start in the active state
     * @type {boolean}
     */
    startActive?: boolean;
}

/**
 * A filter accordion for tags.
 */
export default class TagsFilter extends Component<TagsFilterProps> {
    constructor(props: TagsFilterProps) {
        super(props);

        this.handleFilterStringChange = this.handleFilterStringChange.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleClearFilter = this.handleClearFilter.bind(this);
    }

    public render(tsx: H) {
        return (
            <AccordionDropdown
                key={`${this.props.key}-accordion`}
                title={this.props.title ? this.props.title : tagsI18n.filters.tags.tags}
                clearable={!!this.props.tagsFilter}
                onClear={this.handleClearFilter}
                startActive={this.props.startActive}
                padding={false}
            >
                    <div class="ftr-tags__input-area">
                        <input
                            id="filter-tag-filters"
                            type="search"
                            placeholder={tagsI18n.filters.tags.filterTags}
                            aria-label={tagsI18n.filters.tags.filterTags}
                            oninput={this.handleFilterStringChange}
                            value={this.props.filterString}
                        />
                    </div>
                    <ul
                        class="ftr-tags__tree"
                        id={`${this.props.key}-accordion-tree`}
                        role="tree"
                        aria-label={tagsI18n.filters.tags.tags}
                    >
                        {this.props.availableTags.length > 0 ?
                            this.mapTagsToToggles(tsx) :
                            <p class="ftr-tags__none">{tagsI18n.filters.tags.noTags}</p>
                        }
                    </ul>
            </AccordionDropdown>
        );
    }

    private mapTagsToToggles(tsx: H) {
        return this.props.availableTags
            .map((tag) => (
                <CheckToggle
                    // count={tag.count}
                    key={tag.value}
                    name={tag.value}
                    value={tag.value}
                    selectedToggles={this.props.tagsFilter ? this.props.tagsFilter : undefined}
                    onToggleClick={this.handleToggleClick}
                />
            ));
    }

    private handleToggleClick(value: string, text: string) {
        const tags = this.props.tagsFilter;
        if (tags && !!tags[value]) {
            const newTags = { ...tags };
            delete newTags[value];
            if (Object.keys(newTags).length > 0) {
                this.props.onTagSelect(newTags);
            } else {
                this.props.onTagSelect();
            }
        } else if (tags) {
            this.props.onTagSelect({ ...tags, [value]: true });
        } else {
            this.props.onTagSelect({ [value]: true });
        }
    }

    private handleFilterStringChange(e: any) {
        e.preventDefault();
        this.props.onFilterStringChange(e.target.value);
    }

    private handleClearFilter() {
        if (!!this.props.tagsFilter) {
            this.props.onTagSelect();
        }
    }
}
