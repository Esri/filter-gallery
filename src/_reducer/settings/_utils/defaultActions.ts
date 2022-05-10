import i18n = require("dojo/i18n!../../../nls/resources");
import ioQuery = require("dojo/io-query");
import { CustomAction } from "../config";
import { Pojo } from "../../../Component";
import { FilterGalleryState } from "../..";
import { FilterGalleryStore } from "../../..";
import { addToFavorites, removeFromFavorites, viewMap, viewScene, viewInMap, viewInScene, hashChange, push, VIEW_IN_MAP, VIEW_IN_SCENE, VIEW_SCENE, VIEW_MAP } from "../../../_actions";
import { fetchItemData } from "../../../_utils";

const defaultActions: CustomAction[] = [
  {
    name: i18n.actions.viewMap,
    allowed: (item: Pojo) => item.type === "Web Map",
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 1v14h14V1zm9.082 13c-.005-.037-.113-.274-.122-.309a1.498 1.498 0 0 0 .718-1.267 1.24 1.24 0 0 0-.053-.358 1.594 1.594 0 0 0 .326-.607c.03.002.062.003.093.003a1.415 1.415 0 0 0 .836-.266 1.517 1.517 0 0 0 .126.124 2.385 2.385 0 0 0 1.564.68H14v2h-3.183zM14 11h-.43a1.464 1.464 0 0 1-.906-.433c-.264-.23-.258-.782-.617-.782-.482 0-.52.677-1.003.677-.219 0-.38-.177-.599-.177-.193 0-.445.102-.445.293v.502c0 .424-.506.508-.506.934 0 .171.184.236.184.41 0 .58-.893.502-.893 1.08 0 .191.215.305.215.486V14H6.375a1.545 1.545 0 0 0 .09-.502c0-.547-1.043-.393-1.207-.72-.407-.813.693-1.022.693-1.673 0-.16-.082-.488-.334-.513-.351-.035-.443.154-.797.154a.406.406 0 0 1-.437-.36c0-.386.308-.566.308-.952 0-.25-.102-.393-.102-.643a.619.619 0 0 1 .59-.643c.323 0 .464.264.618.54a.642.642 0 0 0 .617.308c.49 0 .798-.61.798-.977a.471.471 0 0 1 .437-.488c.347 0 .476.36.824.36.57 0 .55-.756 1.053-1.03.618-.332.438-1.052.36-1.44-.032-.169.29-.5.464-.487.72.05.412-.54.412-.823a.434.434 0 0 1 .022-.142c.111-.332.595-.438.595-.836 0-.281-.233-.41-.233-.693a.653.653 0 0 1 .22-.44H14zM2 14V2h8.278c-.013.077-.132.356-.132.44a1.496 1.496 0 0 0 .112.567 1.6 1.6 0 0 0-.422.643 1.428 1.428 0 0 0-.074.442 1.676 1.676 0 0 0-.536.43 1.317 1.317 0 0 0-.32 1.091 3.213 3.213 0 0 1 .066.414 1.987 1.987 0 0 0-.649.67 1.462 1.462 0 0 0-.674-.166 1.447 1.447 0 0 0-1.383 1.086 1.443 1.443 0 0 0-1.086-.469 1.62 1.62 0 0 0-1.591 1.643c0 .254.113.293.084.574s-.29.535-.29 1.022a1.371 1.371 0 0 0 .984 1.29 1.583 1.583 0 0 0-.003 1.549c.143.286.636.774.534.774z"/></svg>',
    href: (item) => `#viewType=${VIEW_MAP}&viewId=${item.id}`,
    id: "map"
  },
  {
    name: i18n.actions.viewScene,
    allowed: (item: Pojo) => item.type === "Web Scene",
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8 7.999 7.999 0 0 0-8-8zm3.83 3.162c.067.24.01.47-.273.47a.669.669 0 0 0 .16-.55c.039.027.08.055.112.08zm-.372-.95l.207.072a.803.803 0 0 0-.428.158.406.406 0 0 1 .222-.23zM7.792 1.01a2.963 2.963 0 0 1 .638.012l-.054.083c-.123-.004-.54-.027-.653-.01.073-.074.015-.021.07-.085zM2.527 12.357a7.018 7.018 0 0 1-.414-.58 6.759 6.759 0 0 1 .58.405.918.918 0 0 0-.166.175zm7.606 2.31a6.986 6.986 0 0 1-7.058-1.695c-.003-.07 0-.08.059-.122 1-.692.512-1.033-1.055-2.047-.123-.084-.179-.132-.19-.165-.075-1.662-.082-.85-.662-2.313a2.123 2.123 0 0 0-.222-.427 6.967 6.967 0 0 1 1.911-4.701c.616.008.934.146 1.176-.473.015-.04.06-.16.073-.121.7.04.593.475 1.518-.9a1.156 1.156 0 0 0 .157-.36c.2-.065.405-.119.613-.166-.465.623-.137 1.095.319 1.095.141 0 .731-.33 1.07-.387.608.03.853.118 1.201-.337a2.112 2.112 0 0 1 .3-.416 6.936 6.936 0 0 1 1.548.498c-.508.388-.222.396-.56.838-.334.444-.017.803.425 1.138a2.056 2.056 0 0 0-.28.242.59.59 0 0 0-.223-.321.669.669 0 0 0-.735-.596.599.599 0 0 0-.147 1.122.573.573 0 0 0 .292.473c-.164.242-.081.414-.01.663-.052 0-.29-.069-.374-.069-.72 0-.785 1.215-.46 1.543-.79.68-.809.795-.917 1.017a1.921 1.921 0 0 0-1.248 1.686c0 .41-.25.36-.317.682-.102.485.146.728.435 1.006.32.311.152.587.628.973.572.477.863.374 1.603.268a2.339 2.339 0 0 1 1.257.134c.09.021.181.057.1.298a.596.596 0 0 0 .133.739.275.275 0 0 1 .11.19c.05.639-.197.474-.47 1.01zm.383-8.91l.2.098a.313.313 0 0 1 .255-.052c.37.233.57.424.93.066a2.055 2.055 0 0 1 .325.339.593.593 0 0 0 .914.493c.214.276.447.177.757.255a1.3 1.3 0 0 1 .088.284 1.486 1.486 0 0 1-.52.136c-.114-.03-.231-.125-.35-.125a.533.533 0 0 0-.656.356 1.398 1.398 0 0 1-.698-.416c.1-.693-.948-.767-1.63-.616.02-.025.108-.16.089-.185a.665.665 0 0 0 .094-.14.838.838 0 0 0 .315-.284zm-.996.222a.732.732 0 0 0-.064.138c0-.055.002-.102.005-.147l.059.01zm1.844 8.16a1.248 1.248 0 0 0-.241-1.173.955.955 0 0 0-.68-1.316c-.006-.002-.38-.081-.473-.113-1.052-.302-1.98.487-2.265-.484a2.546 2.546 0 0 0-.573-.79c.382-.424.237-.624.333-1.035.313-1.157.897-.378 1.276-1.376.017-.042.634-.564.768-.765.379.458.848.204 1.465.243.133.77 1.55 1.512 2.121.763.703.292 1.96-.216 1.646-1.118v.001a1.301 1.301 0 0 0-.112-.342.945.945 0 0 0-.935-.511.8.8 0 0 0-.72-.205c-.255-.554-.903-1.088-1.488-.733a.95.95 0 0 0-.705-.183.798.798 0 0 0-.36-.04 5.498 5.498 0 0 0-.033-.098.782.782 0 0 0 .065-.216.87.87 0 0 0 .691-.33c1.179.708 2.182-1.263.96-1.935.016 0 .03-.01.046-.011a6.994 6.994 0 0 1-.786 11.766z"/></svg>',
    href: (item) => `#viewType=${VIEW_SCENE}&viewId=${item.id}`,
    id: "scene"
  },
  {
    name: i18n.actions.viewApp,
    allowed: (item: Pojo) => (item.type === "Web Mapping Application" || item.type === "Application" || item.type === "StoryMap"),
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M11.364 14.138a1.89 1.89 0 0 0 .036-.545.772.772 0 0 0-.04-.144l-.368-.364a1.497 1.497 0 0 1-.416.949.53.53 0 0 1-.14.224 1.592 1.592 0 0 0-.303.409 6.992 6.992 0 0 1-7.058-1.695v-.017c0-.053 0-.061.059-.105a2.006 2.006 0 0 1 .192-.117.61.61 0 0 0 .272-.334.588.588 0 0 0-.04-.443l-.069-.103a3.563 3.563 0 0 0-.92-.733l-.49-.317c-.123-.084-.179-.132-.19-.165a1.006 1.006 0 0 1 .016-.174 1.559 1.559 0 0 0-.053-.724 5.289 5.289 0 0 0-.316-.748l-.05-.108a7.055 7.055 0 0 1-.259-.56 1.982 1.982 0 0 0-.176-.353 2.667 2.667 0 0 0-.046-.073 6.967 6.967 0 0 1 1.911-4.701c.15.002.31.007.528.028a.68.68 0 0 0 .648-.501c.035-.093.056-.13.066-.13.003 0 .005.002.007.009a.884.884 0 0 1 .204.052 1.282 1.282 0 0 0 .184.044l.108.011a.557.557 0 0 0 .428-.195c.162-.196.422-.557.594-.812a1.156 1.156 0 0 0 .157-.36c.2-.065.405-.119.613-.166a.977.977 0 0 0-.228.523.556.556 0 0 0 .275.5.549.549 0 0 0 .55-.002 2.493 2.493 0 0 1 .793-.313l.523.027a1.338 1.338 0 0 0 .19-.014.624.624 0 0 0 .376-.204l.111-.146.098-.156a1.335 1.335 0 0 1 .184-.244l.019-.016a6.936 6.936 0 0 1 1.547.498 1.574 1.574 0 0 0-.241.222 1.326 1.326 0 0 0-.103.176l-.143.317a.98.98 0 0 1-.073.123.894.894 0 0 0-.087.141.623.623 0 0 0 .137.67 4.213 4.213 0 0 0 .376.327l-.006.005a1.315 1.315 0 0 0-.174.143c-.034.03-.068.063-.101.094a.59.59 0 0 0-.223-.321.594.594 0 0 0-.021-.095.838.838 0 0 0-.249-.376.557.557 0 0 0-.403-.128c-.02 0-.04 0-.062.003a.555.555 0 0 0-.393.303l-.055.121a.56.56 0 0 0 .301.698.58.58 0 0 0 .221.427c.025.015.047.033.07.046a.614.614 0 0 0-.033.59c.005.015.015.042.024.073h-.006a1.44 1.44 0 0 1-.234-.051 1.278 1.278 0 0 0-.134-.018.566.566 0 0 0-.525.337 1.144 1.144 0 0 0-.07.269 3.551 3.551 0 0 0-.03.512.574.574 0 0 0 .165.425 1.376 1.376 0 0 0-.116.123l-.06.07a.747.747 0 0 1-.118.095 1.228 1.228 0 0 0-.53.614l-.093.115-.14.05a2.003 2.003 0 0 0-.922.923 1.787 1.787 0 0 0-.155.396 1.29 1.29 0 0 0-.03.317.581.581 0 0 1-.142.385.555.555 0 0 0-.176.297.928.928 0 0 0-.012.255 1.03 1.03 0 0 0 .15.438.821.821 0 0 0 .16.18l.137.133a.591.591 0 0 1 .165.224 1.515 1.515 0 0 0 .463.749 1.478 1.478 0 0 0 .6.307v-.865a.707.707 0 0 1-.086-.056.736.736 0 0 1-.21-.36 1.34 1.34 0 0 0-.376-.575l-.14-.134a.234.234 0 0 1-.056-.08 1.414 1.414 0 0 0 .322-.898.501.501 0 0 1 .01-.138 1.493 1.493 0 0 1 .1-.235 1.445 1.445 0 0 1 .45-.504l.161-.058a.803.803 0 0 0 .368-.272l.092-.113a.811.811 0 0 0 .106-.194c.028-.072.04-.105.241-.245a1.257 1.257 0 0 0 .185-.144 1.018 1.018 0 0 0 .09-.093l.107-.123a.746.746 0 0 0 .145-.16.803.803 0 0 0 .62.289.819.819 0 0 0 .174-.02 4.216 4.216 0 0 1 .501-.034c.068.002.124.005.17.008a.809.809 0 0 0 .06.195 1.25 1.25 0 0 0 .437.475H13a1.484 1.484 0 0 1 .664.162 1.255 1.255 0 0 0 .292-.062c.101-.04.167-.065.264-.095a.8.8 0 0 0 .52-1.03l.001.001a1.301 1.301 0 0 0-.112-.342.799.799 0 0 0-.535-.453 1.475 1.475 0 0 0-.4-.058.8.8 0 0 0-.72-.205 1.351 1.351 0 0 0-.083-.153 1.654 1.654 0 0 0-.109-.145 3.612 3.612 0 0 0-.286-.296l-.09-.076a.801.801 0 0 0-.92-.063 2.32 2.32 0 0 0-.086-.058.798.798 0 0 0-.283-.11 1.664 1.664 0 0 0-.22-.021 1.118 1.118 0 0 0-.116.006.8.8 0 0 0-.265-.045.78.78 0 0 0-.096.006 5.498 5.498 0 0 0-.032-.099.782.782 0 0 0 .065-.216h.023a.798.798 0 0 0 .553-.221 5.46 5.46 0 0 0 .115-.109.802.802 0 0 0 .413.115 1.029 1.029 0 0 0 .686-.193.798.798 0 0 0 .176-.195l.057-.09a1.253 1.253 0 0 0 .124-1.01.8.8 0 0 0-.287-.42 3.568 3.568 0 0 0-.21-.142c.017 0 .031-.01.047-.011a6.969 6.969 0 0 1 1.753 9.373l.732.724a8.02 8.02 0 1 0-2.114 2.128l-.736-.728c-.14.09-.274.189-.421.27zm-1.908-8.02c0-.056.002-.103.005-.148l.059.01a.732.732 0 0 0-.064.137zm1.173-.152l-.113-.21.2.1a.306.306 0 0 1 .181-.06.452.452 0 0 1 .074.007 1.914 1.914 0 0 1 .176.13.569.569 0 0 0 .34.107.482.482 0 0 0 .245-.055.569.569 0 0 0 .169-.116l.05.042a2.595 2.595 0 0 1 .212.215c.045.055.063.082.063.082a.85.85 0 0 0 .134.347.527.527 0 0 0 .49.242.565.565 0 0 0 .29-.096.655.655 0 0 0 .545.222h.004a.733.733 0 0 1 .208.033 1.3 1.3 0 0 1 .088.284 3.493 3.493 0 0 0-.306.11.359.359 0 0 1-.152.028l-.061-.002a.626.626 0 0 1-.12-.048.635.635 0 0 0-.215-.077h-.015a.56.56 0 0 0-.137-.024.55.55 0 0 0-.52.38 1.398 1.398 0 0 1-.698-.416.593.593 0 0 0-.467-.62 2.133 2.133 0 0 0-.48-.049 4.835 4.835 0 0 0-.557.033 1.07 1.07 0 0 0-.125.02.563.563 0 0 0 .049-.077c.028-.048.05-.092.039-.108a.665.665 0 0 0 .094-.14.838.838 0 0 0 .315-.284zm1.2-2.804a.435.435 0 0 1-.028.363l-.057.09c-.003.002-.031.018-.172.018h-.015a.636.636 0 0 0 .161-.511l-.002-.04c.04.027.081.055.113.08zm-.552-.805a.52.52 0 0 1 .181-.145l.207.072a.809.809 0 0 0-.353.108.906.906 0 0 0-.075.05zm-3.54-1.276c.021-.02.036-.048.055-.07C7.862 1.007 7.93 1 8 1c.145 0 .287.013.43.022l-.054.083-.533-.02a.823.823 0 0 0-.12.01zM2.682 12.189a1.057 1.057 0 0 0-.155.168 7.018 7.018 0 0 1-.414-.58l.02.014a6.12 6.12 0 0 1 .56.391zM10.717 10l4.635 4.584-.704.71L10 10.699V13H9V9h4v1z"/></svg>',
    href: (item: Pojo) => item.url,
    target: "_blank"
  },
  {
    name: i18n.actions.viewInMap,
    allowed: (item: Pojo) => [
      "Feature Service",
      "Vector Tile Service",
      "Map Service",
      "Image Service",
      "OGCFeatureServer"
    ].indexOf(item.type) > -1,
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M13.867 1.488a9.762 9.762 0 0 0-5.867 0 9.745 9.745 0 0 1-5.867 0L0 14.29s3.2 1.6 8 0 8 0 8 0zM7.684 13.34a12.319 12.319 0 0 1-3.892.66 9.531 9.531 0 0 1-2.67-.363l1.82-10.915a12.159 12.159 0 0 0 2.353.24 8.253 8.253 0 0 0 3.078-.546 6.29 6.29 0 0 1 2.334-.402 10.323 10.323 0 0 1 2.28.272l1.76 10.56a11.904 11.904 0 0 0-2.538-.268 14.313 14.313 0 0 0-4.524.762zM12 4H4l-1 8h10zM7.95 5a.742.742 0 0 0-.2.5.75.75 0 0 0 1.5 0 .742.742 0 0 0-.2-.5h2.067l.523 4.18a2.933 2.933 0 0 1-.988-.173 4.25 4.25 0 0 1-1.23-.911l-.108-.107a1.097 1.097 0 0 0-.743-.292 2.532 2.532 0 0 1-1.475-.324 1.985 1.985 0 0 1-.368-.38 2.331 2.331 0 0 0-1.174-.88 1.804 1.804 0 0 0-.806-.038L4.883 5zm-3.817 6l.507-4.054a1.137 1.137 0 0 1 .698-.064 1.584 1.584 0 0 1 .772.618 2.608 2.608 0 0 0 .539.537 3.26 3.26 0 0 0 1.918.46.297.297 0 0 1 .195.07l.099.099a4.956 4.956 0 0 0 1.475 1.077 3.82 3.82 0 0 0 1.404.242L11.867 11zM9.75 6.5a.75.75 0 1 1 .75.75.75.75 0 0 1-.75-.75z"/></svg>',
    href: (item) => `#viewType=${VIEW_IN_MAP}&viewId=${item.id}`,
    id: "mapLayer"
  },
  {
    name: i18n.actions.viewInScene,
    allowed: (item: Pojo) => [
      "Feature Service",
      "Vector Tile Service",
      "Map Service",
      "Image Service",
      "Scene Service"
    ].indexOf(item.type) > -1,
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M14.73 6.023L11.707 3A.5.5 0 0 0 11 3l-.03.03a.5.5 0 0 0-.03.675L12.861 6H3.14l1.92-2.295a.5.5 0 0 0-.03-.675L5 3a.5.5 0 0 0-.707 0L1.27 6.023A1.498 1.498 0 0 0 0 7.5v4A1.502 1.502 0 0 0 1.5 13h4.69a1.495 1.495 0 0 0 1.342-.827c.016-.033.03-.066.043-.1L8 10.936l.425 1.137c.013.034.027.067.043.1A1.495 1.495 0 0 0 9.81 13h4.69a1.502 1.502 0 0 0 1.5-1.5v-4a1.498 1.498 0 0 0-1.27-1.477zM15 11.5a.5.5 0 0 1-.5.5H9.81a.5.5 0 0 1-.448-.277l-.915-2.447a.5.5 0 0 0-.894 0l-.915 2.447a.5.5 0 0 1-.447.277H1.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5z"/><path d="M5.5 8h-3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2.333a.5.5 0 0 0 .475-.342l.666-2A.5.5 0 0 0 5.5 8zm-1.027 2H3V9h1.806zM13.5 8h-3a.5.5 0 0 0-.474.658l.666 2a.5.5 0 0 0 .475.342H13.5a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5zm-.5 2h-1.473l-.333-1H13z"/></svg>',
    href: (item) => `#viewType=${VIEW_IN_SCENE}&viewId=${item.id}`,
    id: "sceneLayer"
  },
  {
    name: i18n.actions.openPdf,
    allowed: (item: Pojo) => item.type === "PDF",
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 1h8v1H2v12h12V7h1v8H1zm7.325 7.382L14 2.707V5h1V1h-4v1h2.293L7.618 7.675z"/><path fill="none" d="M0 0h16v16H0z"/></svg>',
    href: (item: Pojo, state: FilterGalleryState) =>
      `${state.settings.utils.portal.restUrl}/content/items/${item.id}/data${
        state.settings.utils.portal.credential ?
            `?token=${state.settings.utils.portal.credential.token}` :
            ""
    }`,
    target: "_blank"
  },
  {
    name: i18n.actions.openDoc,
    allowed: (item: Pojo) => item.type === "Document Link",    
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 1h8v1H2v12h12V7h1v8H1zm7.325 7.382L14 2.707V5h1V1h-4v1h2.293L7.618 7.675z"/><path fill="none" d="M0 0h16v16H0z"/></svg>',
    href: (item: Pojo) => item.url,
    target: "_blank"
  },
  {
    name: i18n.actions.openTab, 
    allowed: (item: Pojo) => item.type === "Dashboard",    
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 1h8v1H2v12h12V7h1v8H1zm7.325 7.382L14 2.707V5h1V1h-4v1h2.293L7.618 7.675z"/><path fill="none" d="M0 0h16v16H0z"/></svg>',
    href: (item: Pojo, state: FilterGalleryState) => {
      const portalUrl = !!state.settings.utils.portal.credential ? state.settings.utils.portal.baseUrl : `https://${state.settings.utils.portal.portalHostname}`
      const url = portalUrl + "/apps/opsdashboard/index.html#/" + item.id;
      return url;
    },
    target: "_blank"
  }, 
  {
    name: i18n.actions.openTab, 
    allowed: (item: Pojo) => item.type === "Hub Site Application",    
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 1h8v1H2v12h12V7h1v8H1zm7.325 7.382L14 2.707V5h1V1h-4v1h2.293L7.618 7.675z"/><path fill="none" d="M0 0h16v16H0z"/></svg>',
    href: (item: Pojo) => item.url,
    target: "_blank"
  },
  {
    name: i18n.actions.openTab, 
    allowed: (item: Pojo) => item.type === "Web Experience" && item.typeKeywords.includes("status: Published"),    
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M1 1h8v1H2v12h12V7h1v8H1zm7.325 7.382L14 2.707V5h1V1h-4v1h2.293L7.618 7.675z"/><path fill="none" d="M0 0h16v16H0z"/></svg>',
    href: (item: Pojo, state: FilterGalleryState) => {
      const portal: string = state.settings.utils.portal.baseUrl;
      const base = portal.indexOf("mapsdevext.arcgis.com") !== -1 ?
                      "https://experiencedev.arcgis.com/experience/" :
                      portal.indexOf("mapsqa.arcgis.com") !== -1 ?
                        "https://experienceqa.arcgis.com/experience/" :
                        "https://experience.arcgis.com/experience/";
      const url = base + item.id;
      return url;
    },
    target: "_blank"
  },
  {
    name: i18n.actions.download,
    allowed: (item: Pojo) => [
      "CSV",
      "Deep Learning Package",
      "Insights Workbook Package"
    ].indexOf(item.type) > -1,
    asynchronous: false,
    onAction: () => { },
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M16 7.621A3.3 3.3 0 0 1 13.063 11H13v-1h.063A2.337 2.337 0 0 0 15 7.621a2.508 2.508 0 0 0-1.705-2.396l-.592-.196-.085-.618A3.808 3.808 0 0 0 8.988 1a3.652 3.652 0 0 0-3.205 2.039l-.37.714-.778-.21a1.592 1.592 0 0 0-.42-.067A1.34 1.34 0 0 0 2.86 4.75l-.04.56-.498.257A2.419 2.419 0 0 0 1 7.72 2.24 2.24 0 0 0 3 10h1v1H3a3.225 3.225 0 0 1-3-3.28 3.428 3.428 0 0 1 1.863-3.041 2.331 2.331 0 0 1 2.353-2.203 2.588 2.588 0 0 1 .68.101A4.64 4.64 0 0 1 8.988 0a4.788 4.788 0 0 1 4.622 4.275A3.515 3.515 0 0 1 16 7.621zm-7 5.656V6H8v7.277l-1.602-1.602-.707.707 2.809 2.81 2.81-2.81-.708-.707z"/></svg>',
    href: (item: Pojo, state: FilterGalleryState) =>
      `${state.settings.utils.portal.restUrl}/content/items/${item.id}/data${
        state.settings.utils.portal.credential ?
            `?token=${state.settings.utils.portal.credential.token}` :
            ""
    }`,
    target: "_blank"
  },
  {
    name: i18n.actions.addFavorite,
    allowed: (item: Pojo, state: FilterGalleryState) => {
      return !!state.settings.utils.portal.user &&
        !!state.results.user.favorites &&
        !state.results.user.favorites[item.id];
    },
    asynchronous: false,
    onAction: (item: Pojo, state: FilterGalleryState, dispatch: FilterGalleryStore["dispatch"]) => {
      dispatch(addToFavorites(item));
    },
    icon: '<svg width="16" height="16" viewBox="0 0 32 32"><path d="M16.043.367L19.813 12H32l-9.859 7.172 3.789 11.625-9.887-7.193-9.889 7.193 3.787-11.625L0 12h12.271z"/></svg>'
  },
  {
    name: i18n.actions.removeFavorite,
    allowed: (item: Pojo, state: FilterGalleryState) => {
      return !!state.settings.utils.portal.user &&
        !!state.results.user.favorites &&
        !!state.results.user.favorites[item.id];
    },
    asynchronous: false,
    onAction: (item: Pojo, state: FilterGalleryState, dispatch: FilterGalleryStore["dispatch"]) => {
      dispatch(removeFromFavorites(item));
    },
    icon: '<svg width="16" height="16" viewBox="0 0 32 32"><path fill="#fad817" d="M16.043.367L19.813 12H32l-9.859 7.172 3.789 11.625-9.887-7.193-9.889 7.193 3.787-11.625L0 12h12.271z" /></svg>'
  },
  {
    name: i18n.actions.openViewer,
    allowed: (item: Pojo) => _canOpenInNewMapViewer(item),
    asynchronous: false,
    onAction: () => { },
    icon: '<svg class="svg" height="16" width="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 2v20h20V2zm19 17.194l-5.604-1.6L10.837 3H21zM3 3h6.789l2.457 7.864L3 12.845zm0 18v-7.154a1.03 1.03 0 0 0 .21-.022l9.336-2.001 2.058 6.583L21 20.234V21z" opacity="1"></path><path d="M21 19.194l-5.604-1.6L10.837 3H21v16.194z" opacity=".5"></path><path d="M3 21v-7.154a1.03 1.03 0 0 0 .21-.022l9.336-2.001 2.058 6.583L21 20.234V21z" opacity=".2"></path></svg>',
    href: (item: Pojo, state: FilterGalleryState) => {
      const portalUrl = !!state.settings.utils.portal.credential ? state.settings.utils.portal.baseUrl : `https://${state.settings.utils.portal.portalHostname}`;
      const itemTypeParam = item.type === "Web Map" ? "webmap=" : "layers=";
      const url = portalUrl + "/apps/mapviewer/index.html?" + itemTypeParam + item.id;
      return url;
    },
    target: "_blank"
  },
];

export default defaultActions;

const _canOpenInNewMapViewer = (item: Pojo): boolean => {
  const { type } = item;
  const supportedLayerTypes = {
    "Feature Service": 1,
    "Map Service": 1,
    "Vector Tile Service": 1,
    "Image Service": 1,
    "Imagery Layer": 1,
    "KML": 1,
    "OGCFeatureServer": 1,
    "WFS": 1,
    "WMS": 1,
    "WMTS": 1
  };
  if (type === "Web Map") {
    return true;
  } else if (type in supportedLayerTypes && _canOpenServiceInNewMapViewer(item)) {
    return true;
  } 
  return false;
};

const _canOpenServiceInNewMapViewer = (item: Pojo): boolean => {
  const { type, isTable, typeKeywords } = item;
  const eligibleType = [
    "Map Service",
    "Vector Tile Service",
    "Imagery Layer",
    "Image Service",
    "Feature Service",
    "KML",
    "WFS",
    "WMS",
    "WMTS",
    "OGCFeatureServer"
  ];
  return isTable || eligibleType.indexOf(type) > -1 || typeKeywords.indexOf("Hosted Service") > -1;
};