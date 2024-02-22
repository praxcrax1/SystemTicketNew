import { createSelector, ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as appReducer from "./app.reducer";



export interface State {
    AppData : appReducer.State

}
export const reducers: ActionReducerMap<State> = {
    AppData : appReducer.appReducer,
};

export const metaReducers: MetaReducer<State>[] = [];


export const selectFormData = (state: State) => state.AppData;
export const getFormData = createSelector(selectFormData, appReducer.selectFormData);

