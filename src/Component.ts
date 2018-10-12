import {
    createProjector as originalCreateProjector,
    h,
    ProjectionOptions,
    Projector as OriginalProjector
} from "maquette";
import { compose, pickBy, mapObjIndexed } from "./_utils";
import { merge, Observable, Subject } from "rxjs";
import { scan, startWith } from "rxjs/operators";

/**
 * Plain Ol' JavaScript Object
 */
export interface Pojo {
    [propName: string]: any;
}

////////////////////////////
//
// VIRTUAL DOM & COMPONENTS
//
////////////////////////////

/**
 * Base props for components
 */
export interface ComponentProps {
    key: string;
    children?: JSX.Element[];
}

/**
 * Base props for stateless functional components
 */
export interface SFCProps {
    [propName: string]: any;
    children?: JSX.Element[];
}

export interface ComponentConstructor {
    new(props: any): Component<any>;
}

export type SFC = (props: SFCProps, tsx: H) => JSX.Element[] | JSX.Element | void;
export interface Projector extends OriginalProjector {
    append: (node: Element) => void;
}

/**
 * Creates a Projector instance, which projects the VDOM tree to a specified DOM node
 * @param store - The big atom state store for the component tree
 * @param renderRoot - The root render function for the tree of VDOM
 * @param node - The DOM node to render the VDOM into
 * @param projectorOptions -  Options that influence how the DOM is rendered and updated
 */
export function createProjector(
    store: Store<any>,
    renderRoot: (tsx: H) => JSX.Element | void,
    node: Element,
    projectorOptions?: ProjectionOptions
) {
    const rc = new RootComponent({ key: "root" }, renderRoot);
    rc["store"] = store;
    const projector = originalCreateProjector(projectorOptions);
    const newProjector = {
        ...projector,
        /**
         * Appends the projector to a specified DOM node.
         * @param node - The root DOM element to render the virtual DOM tree into.
         */
        append: (node: Element) => projector.append(
            node,
            () => rc.render.bind(rc)(rc.tsx.bind(rc))
        )
    };
    newProjector.append(node);
    store.state$.subscribe(() => projector.scheduleRender());
    return newProjector;
}

/**
 * Returns a virtual DOM representation of the target component or element.
 * @param element - The component of element to create VDOM for.
 * @param properties - HTML attributes or component props to provide to the element.
 * @param children - Child components or elements to render within this child.
 */
export type H = (
    element: ComponentConstructor | SFC | string,
    properties?: ComponentProps | SFCProps | JSX.ElementAttributesProperty,
    children?: (ComponentConstructor | SFC | string)[]
) => JSX.Element | void;

export type RenderCTX = (dispatch?: Store<any>["dispatch"], getState?: Store<any>["getState"]) =>
    JSX.Element | void;

/**
 * A component which returns virtual DOM from its render method.
 */
export abstract class Component<
    Props extends ComponentProps,
    State extends Pojo = {}
> {
    /**
     * Array of child components rendered by this component.
     */
    public childComponents: {
        [key: string]: Component<ComponentProps>;
    } = {};
    /**
     * A component's props are passed into it by its parent component prior to rendering.
     * Props should be assumed to always reflect the current state of the application.
     */
    public props: Props;
    /**
     * A component can maintain its own class-level state, which can be passed down to
     * child components through props. 
     */
    protected state: State = {} as State;
    /**
     * The store for the current scope. 
     */
    private store: Store<any>;
    constructor(props: Props) {
        this.props = props;
    }

    /**
     * The component's render function returns virtual DOM as a function of application state.
     * It is used to create the virtual DOM tree representing the application's view.
     */
    abstract render(tsx: H): JSX.Element[] | JSX.Element | void | RenderCTX;

    /**
     * Lifecycle method called when a component is successfully connected to its parent's store. 
     */
    public componentDidConnect() {}

    /**
     * Lifecycle method called prior to the component's props updating.
     */
    public componentWillReceiveProps(nextProps: Props) {}

    /**
     * Update's the component's class level state.
     * @param newState - Shallow partial clone of the component's state.
     */
    protected setState(newState: Partial<State>) {
        this.state = { ...this.state as any, ...newState as any };
        if (this.store) {
            this.store.dispatch({ type: `${this.props.key}_COMPONENT_STATE_UPDATE` });
        } else {
            console.warn(`
                A component's 'setState' method was called from its constructor function.
                Set component state directly in the constructor function, and use 'setState' in callbacks etc.
            `);
        }
    }

    /**
     * Returns a virtual DOM representation of the target component or element.
     * @param element - The component of element to create VDOM for.
     * @param properties - HTML attributes or component props to provide to the element.
     * @param children - Child components or elements to render within this child.
     */
    public tsx(
        element: ComponentConstructor | SFC | string,
        properties?: ComponentProps | SFCProps | JSX.ElementAttributesProperty,
        children?: (ComponentConstructor | SFC | string)[]
    ): JSX.Element | void {
        let result;
        const ch = Array.prototype.slice.call(arguments).slice(2); // Force children to be array..
        if (typeof element === "string") { // Rendering ordinary hyperscript
            result = h.apply(this, [element, properties, ch]);
        } else if (!isConstructor(element as Function)) { // Rendering a functional component
            const el = element as SFC;
            result = el({ ...properties, children: ch }, this.tsx.bind(this));
        } else { // Rendering a class-based Component
            const el = element as ComponentConstructor;
            const props = { ...properties, children: ch } as ComponentProps;
            let child = this.childComponents[props.key];
            if (child) { // This child has already been instantiated
                child.componentWillReceiveProps(props);
                child.props = (props);
                result = child.render(child.tsx.bind(child));
            } else { // Need to instantiate the component
                child = this.childComponents[props.key] = new el(props);
                child.store = this.store;
                child.componentDidConnect();
                result = child.render(child.tsx.bind(child));
            }
        }
        return typeof result === "function" ? result(this.store.dispatch, this.store.getState) : result;
    }
}

/**
 * Root component used as the entrypoint for projector.
 * This is necessary to allow store-connected components to be used from the root.
 */
export class RootComponent extends Component<{ key: string }> {
    private renderRoot: (tsx: H) => JSX.Element | void;
    constructor(props: { key: string }, renderRoot: (tsx: H) => JSX.Element | void) {
        super(props);
        this.renderRoot = renderRoot;
    }

    public render(tsx: H) { return tsx(({}, t: H) => this.renderRoot(t)); }
}

/**
 * Connect provides the ability to map the store's state and dispatch method to a component's props.
 * Providing store functionality through connect prevents components from becoming tightly coupled to a store.
 * Any props which are not mapped from the store through connect will be exposed from the resulting
 * wrapped component unchanged.
 * @param mapStateToProps - Function returning props based on the store state
 * @param mapDispatchToProps - Function returning props based on the store's dispatch function
 * @template WrappedProps - The props for the component being wrapped with connect.
 * @template S - The type of store being connected.
 * @template StateProps - The props to map to the store state.
 * @template DispatchProps - The props to map to the store's dispatch method.
 */
export function connect<
    WrappedProps = {},
    ComponentStore extends Store<any> = Store<any>,
    StateProps = {},
    DispatchProps = {}
>(
    mapStateToProps: (
        state: ReturnType<ComponentStore["getState"]>,
        ownProps: Pick<WrappedProps, Exclude<keyof WrappedProps, keyof StateProps | keyof DispatchProps>>
    ) => StateProps,
    mapDispatchToProps: (
        dispatch: ComponentStore["dispatch"],
        ownProps: Pick<WrappedProps, Exclude<keyof WrappedProps, keyof StateProps | keyof DispatchProps>>
    ) => DispatchProps
) {
    return (WrappedComponent: ComponentConstructor) => (
        ownProps: Pick<WrappedProps, Exclude<keyof WrappedProps, keyof StateProps | keyof DispatchProps>>,
        hy: H
    ) => (
        dispatch: ComponentStore["dispatch"],
        getState: () => ReturnType<ComponentStore["getState"]>
    ) => (
        hy(WrappedComponent, {
            ...ownProps as any,
            ...mapStateToProps(getState(), ownProps) as any,
            ...mapDispatchToProps(dispatch, ownProps) as any
        })
    );
}

/**
 * Returns true if the provided function is a constructor
 * @param f - Object to check if constructor
 */
function isConstructor(f: Function) {
    return !!f.prototype && !!f.prototype.constructor.name;
}

/**
 * Hack in support for Function.name in IE
 */
if (Function.prototype["name"] === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, "name", {
        get: function() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : "";
        },
        set: function(value) {}
    });
}

////////////////////////////
//
// STATE MANAGEMENT
//
////////////////////////////

export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
export type Dispatch<A extends Action = Action> = (action: A) => A;
export type Middleware<DispatchExt = {}, S = any, D extends Dispatch = Dispatch> =
    (api: MiddlewareAPI<D, S>) => (next: Dispatch) => (action: any) => any;
export type Reducer<S> = (state: S | undefined, action: Action) => S;
export type StoreCreator<S> = (reducer: Reducer<S>, initialState: S) => Store<S>;
export type StoreEnhancer<Ext = {}, StateExt = {}> =
    (next: StoreEnhancerStoreCreator) => StoreEnhancerStoreCreator<Ext, StateExt>;
export type StoreEnhancerStoreCreator<Ext = {}, StateExt = {}> =
    <S = any>(reducer: Reducer<S>, preloadedState?: S) => Store<S & StateExt> & Ext;

export interface Action { type: string; payload?: any; }
export interface MiddlewareAPI<D extends Dispatch = Dispatch, S = any> {
    action$: Subject<Action>;
    dispatch: Dispatch;
    getState: () => S;
    state$: Observable<S>;
}
export interface Store<S> {
    action$: Subject<Action>;
    dispatch: Dispatch;
    getState: () => S;
    state$: Observable<S>;
}

/**
 * Returns a new store creator with dispatch wrapped by the supplied middleware functions
 * @param middlewares - middleware functions
 */
export function applyMiddleware<Ext1, Ext2, Ext3, Ext4, Ext5, S>(
    middleware1: Middleware<Ext1, S, any>,
    middleware2: Middleware<Ext2, S, any>,
    middleware3: Middleware<Ext3, S, any>,
    middleware4: Middleware<Ext4, S, any>,
    middleware5: Middleware<Ext5, S, any>
): StoreEnhancer<{dispatch: Ext1 & Ext2 & Ext3 & Ext4 & Ext5}>;
export function applyMiddleware<Ext1, Ext2, Ext3, Ext4, S> (
    middleware1: Middleware<Ext1, S, any>,
    middleware2: Middleware<Ext2, S, any>,
    middleware3: Middleware<Ext3, S, any>,
    middleware4: Middleware<Ext4, S, any>
): StoreEnhancer<{dispatch: Ext1 & Ext2 & Ext3 & Ext4}>;
export function applyMiddleware<Ext1, Ext2, Ext3, S> (
    middleware1: Middleware<Ext1, S, any>,
    middleware2: Middleware<Ext2, S, any>,
    middleware3: Middleware<Ext3, S, any>
): StoreEnhancer<{dispatch: Ext1 & Ext2 & Ext3}>;
export function applyMiddleware<Ext1, Ext2, S>(
    middleware1: Middleware<Ext1, S, any>,
    middleware2: Middleware<Ext2, S, any>
): StoreEnhancer<{dispatch: Ext1 & Ext2}>;
export function applyMiddleware<Ext1, S>(middleware1: Middleware<Ext1, S, any>): StoreEnhancer<{dispatch: Ext1}>;
export function applyMiddleware<Ext, S = any>(
    ...middlewares: Middleware<any, S, any>[]
): StoreEnhancer<{dispatch: Ext}>;
export function applyMiddleware(...middlewares: Array<Middleware>): StoreEnhancer {
    return (next: StoreEnhancerStoreCreator) => (reducer: Reducer<any>, initialState: any) => {
        const store = next(reducer, initialState);
        const c = compose as any;
        let dispatch = store.dispatch;

        const chain = middlewares.map((middleware) => middleware({
            action$: store.action$,
            dispatch: (action: Action) => dispatch(action),
            getState: store.getState,
            state$: store.state$
        }));
        dispatch = c(...chain)(store.dispatch);

        return { ...store, dispatch };
    };
}

type Epic<T> = (action$: Subject<Action>, state$: Observable<T>) => Observable<Action>;
/**
 * Creates middleware for handling asynchrony and side effects with observable streams
 * @param epic - The root epic for the application
 */
export function createEpicMiddleware<T>(epic: Epic<T>): Middleware<T> {
    return ({ action$, dispatch, state$ }) => {
        epic(action$, state$).subscribe(dispatch);
        return (next) => (action) => next(action);
    };
}

/**
 * Merge all epics into a single, particularly epic, epic.
 * @param epics - Epics to be mergd into one.
 */
export function combineEpics<T>(...epics: Array<Epic<T>>): Epic<T> {
    return (...args) => merge(
        ...epics.map((epic) => epic(...args))
    );
}

/**
 * Composes reducing functions for separate state slices into a single reducing function
 * @param reducers - Object mapping keys to the corresponding reducing function for the state slice
 */
export function combineReducers<T>(reducers: { [P in keyof T]: Reducer<T[P]> }) {
    const finalReducers = pickBy<{ [P in keyof T]: Reducer<T[P]> }, { [P in keyof T]: Reducer<T[P]> }>(
        (val) => typeof val === "function",
        reducers
    );
    return (state: T = {} as T, action: Action): T => {
        return mapObjIndexed(
            (r: Reducer<T[keyof T]>, key) => r(state[key], action),
            finalReducers
        ) as any as T;
    };
}

/**
 * Returns a big atom state store of shape <S>
 * @param reducer - the root reducer for the state tree 
 * @param initialState - the initial state for the tree
 */
export function createStore<S>(reducer: Reducer<S>, initialState?: S): Store<S> {
    let currentState: S = reducer(initialState, { type: "@@component/INIT" + Math.random().toString(36).substring(7) });
    function getState() {
        return currentState;
    }

    const action$ = new Subject<Action>();
    const dispatch: Dispatch = (action: Action) => {
        action$.next(action);
        return action;
    };
    const state$ = action$.pipe(
        startWith(currentState),
        scan(reducer)
    ) as Observable<S>;
    state$.subscribe((newState: S) => { currentState = newState; });
    return { action$, dispatch, getState, state$ } as Store<S>;
}
