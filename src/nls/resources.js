define({
    root: ({
        appInit: "Initializing application...",
        appFailed: "Failed to load the app.",
        noAuth: "Your account is not licensed to use Configurable Apps that are not public. Please ask your organization administrator to assign you a user type that includes Essential Apps or an add-on Essential Apps license.",
        notLicensed: "Not Licensed",
        badges: {
            authoritative: "Authoritative", // arcgisonline.filters.authoritative
            deleted: "Deleted",
            deprecated: "Deprecated", // arcgisonline.filters.deprecated
            livingAtlas: "Living Atlas", // arcgisonline.badges.livingAtlas
            marketplace: "Marketplace", // arcgisonline.badges.marketplace
            openData: "Open Data", // arcgisonline.badges.openData
            premium: "Premium", // arcgisonline.badges.premium
            subscriber: "Subscriber", // arcgisonline.badges.subscriber
            tooltips: {
                altAuthoritative: "Authoritative: Recommended by",
                authoritative: "Authoritative: Recommended by your organization", // arcgisonline.badges.authoritativeTooltip
                deprecated: "Deprecated: Not recommended for use", // arcgisonline.badges.deprecatedTooltip
                livingAtlas: "Living Atlas: Esri-curated content", // arcgisonline.badges.livingAtlasTooltip
                marketplace: "Listed on the ArcGIS Marketplace", // arcgisonline.badges.marketplace
                openData: "Available for public use", // arcgisonline.badges.openDataTooltip
                premiumAnon: "Premium: Requires signing in with an ArcGIS Online subscription and consumes credits",
                subscriberAnon: "Subscriber: Requires signing in with an ArcGIS Online subscription",
                premiumPublic: "Premium: Requires an ArcGIS Online subscription and consumes credits",
                subscriberPublic: "Subscriber: Requires an ArcGIS Online subscription",
                premiumOrg: "Premium: Exclusive content for subscribers. Consumes credits.",
                subscriberOrg: "Subscriber: Exclusive content for subscribers"
            }
        },
        buttons: {
            clear: "Clear"
        },
        dateSelection: {
            today: "Today", // arcgisonline.filters.today
            yesterday: "Yesterday", // arcgisonline.filters.yesterday
            last7Days: "Last 7 Days", // arcgisonline.filters.last7Days
            last30Days: "Last 30 Days", // arcgisonline.filters.last30Days
            custom: "Custom Range...", // arcgisonline.filters.customRange
            from: "Start date", // arcgisonline.filters.from
            to: "End date" // arcgisonline.filters.to
        },
        dropdowns: {
            clear: "Clear",
            clearAll: "Clear All",
            contentViews: {
                "grid": "Grid",
                "list": "List",
                "table": "Table",
                "view": "View"
            },
            sorting: {
                sort: "Sort",
                sortBy: "Sort by",
                sortDir: "Sort direction",
                relevance: "Relevance", // arcgisonline.sortDropdown.relevance
                title: "Title", // arcgisonline.sortDropdown.title
                owner: "Owner", // arcgisonline.sortDropdown.owner
                created: "Date Created", // arcgisonline.sortDropdown.created
                modified: "Date Modified", // arcgisonline.sortDropdown.modified
                numviews: "View Count", // arcgisonline.sortDropdown.views
                avgrating: "Rating", // arcgisonline.sortDropdown.rating
                ascending: {
                    relevance: "Least to most relevant", 
                    title: "Alphabetical",
                    owner: "Alphabetical",
                    created: "Least recent",
                    modified: "Least recent",
                    numviews: "Least to most",
                    avgrating: "Lowest to highest rated"
                },
                descending: {
                    relevance: "Most to least relevant",
                    title: "Reverse-alphabetical",
                    owner: "Reverse-alphabetical",
                    created: "Most recent", // arcgisonline.galleryPage.mostRecent
                    modified: "Most recent", // arcgisonline.galleryPage.mostRecent
                    numviews: "Most to least",
                    avgrating: "Highest to lowest rated"
                }
            }
        },
        filters: {
            itemType: {
                itemType: "Item Type", // arcgisonline.GroupWidget.itemType
                filters: {
                    maps: "Maps", // arcgisonline.galleryPage.maps
                    webMaps: "Web Maps", // arcgisonline.gallery.filters.webMaps
                    mapFiles: "Map Files", // arcgisonline.gallery.filters.mapFiles
                    layers: "Layers", // arcgisonline.gallery.filters.layers
                    featureLayers: "Feature Layers", // arcgisonline.gallery.filters.features
                    tileLayers: "Tile Layers", // arcgisonline.gallery.filters.tiles
                    mapImageLayers: "Map Image Layers", // arcgisonline.gallery.filters.mapimage
                    imageryLayers: "Imagery Layers", // arcgisonline.gallery.filters.layers
                    sceneLayers: "Scene Layers", // arcgisonline.folders.weblayers.imagery
                    tables: "Tables", // arcgisonline.itemProperties.mapTables
                    layerFiles: "Layer Files", // arcgisonline.folders.layers.layerFiles
                    scenes: "Scenes", // arcgisonline.searchFilters.scenes
                    apps: "Apps", // arcgisonline.searchFilters.applications
                    webApps: "Web Apps", // arcgisonline.searchFilters.webApplications
                    mobileApps: "Mobile Apps", // arcgisonline.searchFilters.mobileApplications
                    desktopApps: "Desktop Apps", // arcgisonline.searchFilters.desktopApplications
                    tools: "Tools", // arcgisonline.searchFilters.tools
                    locators: "Locators", // arcgisonline.searchFilters.addressLocators
                    geodatabaseAccess: "Geodatabase Access", // arcgisonline.searchFilters.geodatabaseAccess
                    geometricOperations: "Geometric Operations", // arcgisonline.searchFilters.geoOperations
                    geoprocessingTasks: "Geoprocessing Tasks", // arcgisonline.searchFilters.geoTasks
                    networkAnalysis: "Network Analysis", // arcgisonline.searchFilters.netAnalysis
                    files: "Files", // arcgisonline.organizationStatus.svcusg_portal
                    documents: "Documents", // arcgisonline.folders.files.document
                    images: "Images", // arcgisonline.folders.files.image
                    pdfs: "PDFs", // arcgisonline.folders.files.pdfs,
                    webTools: "Web Tools",
                    notebooks: "Notebooks"
                }
            },
            date: {
                dateCreated: "Date Created",
                dateModified: "Date Modified"
            },
            shared: {
                shared: "Shared", // arcgisonline.items.shared
                options: {
                    public: "With Everyone (public)", // arcgisonline.itemSharing.public
                    org: "With Organization", // arcgisonline.itemSharing.org
                    shared: "With Groups", // arcgisonline.itemSharing.shared
                    private: "With No One" // arcgisonline.itemSharing.private
                }
            },
            status: {
                status: "Status", // arcgisonline.filters.status
                options: {
                    authoritative: "Authoritative", // arcgisonline.filters.authoritative
                    deprecated: "Deprecated", // arcgisonline.filters.deprecated
                    premium: "Premium" // arcgisonline.badges.premium
                }
            },
            tags: {
                tags: "Tags",
                filterTags: "Filter tags",
                noTags: "No tags were found matching your search."
            }
        },
        gallery: {
            signIn: "Sign In",
            signOut: "Sign Out",
            header: {
                browse: "Browse", // arcgisonline.common.browser
                search: "Search" // arcgisonline.common.search
            },
            resultCount: "Items:", //items 
            searchPlaceholders: {
                generic: "Enter search terms" // arcgisonline.browseItemsDlg.placeholder
            },
            filterChips: {
                mapArea: "Within Map Area", // arcgisonline.addContentPanel.withinMapArea
                type: "Type", // arcgisonline.items.type
                dateModified: "Modified", // arcgisonline.items.modified
                dateCreated: "Created", // arcgisonline.manageLicenses.session.createdLabel
                access: "Shared", // arcgisonline.items.shared
                group: "Group", // arcgisonline.items.group
                folder: "Folder", // arcgisonline.itemProperties.folder
                status: "Status", // arcgisonline.collaborations.statusLabel
                clearAll: "Clear All", // arcgisonline.GroupWidget.clearAll
                category: "Category", // arcgisonline.contentCategories.chipText
                region: "Region", // arcgisonline.organizationSetup.regionSetting
                tagged: "Tagged"
            },
            itemDetails: {
                addToMap: "Add to Map", // arcgisonline.items.addToMap
                removeFromMap: "Remove from Map",
                by: "by", // arcgisonline.itemProperties.by ( by <author> )
                lastModified: "Updated", // arcgisonline.contentPage.modified
                noSnippet: "A brief summary of the item is not available.", // arcgisonline.itemProperties.summaryUnavailable
                details: "Description", // arcgisonline.tocPanel.description
                termsOfUse: "Terms of Use", // arcgisonline.itemProperties.access
                attribution: "Credits (Attribution)", // arcgisonline.itemProperties.credits
                noTermsOfUse: "No special restrictions or limitations on using the item’s content have been provided.", // arcgisonline.itemProperties.attributionUnavailable
                noAttribution: "No acknowledgements.", // arcgisonline.itemProperties.creditsUnavailable
                noDescription: "An in-depth description of the item is not available.", // arcgisonline.itemProperties.descriptionUnavailable
                views: "View Count", // arcgisonline.sortDropdown.views
                created: "Created", // arcgisonline.manageLicenses.session.createdLabel
                sharedWith: "Shared with", // arcgisonline.filters.access
                shared: {
                    public: "Everyone (public)", // arcgisonline.groupsPage.everyone
                    org: "Organization", // arcgisonline.createAccount.organizationLabel
                    shared: "The item is not shared.", // arcgisonline.itemProperties.itemNotShared
                    private: "The item is not shared." // arcgisonline.itemProperties.itemNotShared
                },
                viewUser: "View user profile", // argisonline.viewsWidget.viewUserprofile
                viewOrg: "Visit organization",
                addToFavorites: "Add to Favorites", // arcgisonline.common.favorite
                removeFromFavorites: "Remove from Favorites", // arcgisonline.common.unfavorite
                managedBy: "Managed by:"
            },
            results: {
                loadingItems: "Loading items..",
                requestError: "There was an error with the request.",
                noItemsFound: "No items found that meet your criteria. Try clearing some filters to show more items.", // arcgisonline.GroupWidget.noItems
                empty: "Enter some terms above to begin your search."
            },
            search: "Search", // arcgisonline.search.searchTitle
            close: "Close", // arcgisonline.common.close
            filterPane: {
                filter: "Filter", // arcgisonline.FilterDlg.filter
                categories: "Categories", // arcgisonline.contentCategories.categories
                groupCategories: "Group Categories" // arcgisonline.groupCategories.categories
            },
            viewDetails: "View item details",
            back: "Back",
            compact: "Table", // arcgisonline.viewToggle.table
            compactView: "Compact view",
            list: "List", // arcgisonline.viewToggle.list
            listView: "List view",
            showing: "Showing",
            viewResults: "View results"
        },
        itemCards: {
            remove: "Remove",
            add: "Add",
            by: "by",
            actions: "Actions",
            viewOrg: "Visit organization",
            viewProfile: "View user profile",
            viewItem: "View item details",
            hideItem: "Hide item details",
            created: "Created",
            updated: "Updated",
            viewCount: "View Count",
            rating: "Rating"
        },
        pager: {
            previous: "Previous",
            next: "Next",
            paginationLimit: "There is a limit of 10,000 results that can be retrieved via pagination. Try filtering or changing your search term to lower the number of returned results."
        },
        actions: {
            viewMap: "View Map",
            viewScene: "View Scene",
            viewApp: "View App",
            viewInMap: "View in Map",
            viewInScene: "View in Scene",
            download: "Download",
            openPdf: "Open in PDF",
            addFavorite: "Add to Favorites",
            removeFavorite: "Remove from Favorites"
        },
        viewer: {
            back: "Return to Gallery",
            viewLoading: {
                "scripts": "Fetching scripts..",
                "map": "Preparing the map..",
                "basemap": "Loading the basemap..",
                "layers": "Processing layers..",
                "view": "Initializing the view..",
                "widgets": "Adding Widgets..",
                "failed": "The item failed to load.",
                "sorry": "Sorry, something went wrong loading the requested item."
            }
        }
    }),
    "ar": 1,
    "bs": 1,
    "ca": 1,
    "cs": 1,
    "da": 1,
    "de": 1,
    "el": 1,
    "es": 1,
    "et": 1,
    "fi": 1,
    "fr": 1,
    "he": 1,
    "hr": 1,
    "hu": 1,
    "id": 1,
    "it": 1,
    "ja": 1,
    "ko": 1,
    "lt": 1,
    "lv": 1,
    "nl": 1,
    "nb": 1,
    "pl": 1,
    "pt-br": 1,
    "pt-pt": 1,
    "ro": 1,
    "ru": 1,
    "sr": 1,
    "sv": 1,
    "th": 1,
    "tr": 1,
    "uk": 1,
    "vi": 1,
    "zh-cn": 1,
    "zh-hk": 1,
    "zh-tw": 1
});
