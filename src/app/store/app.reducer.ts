import { createReducer, on } from "@ngrx/store";
import { InputFormData } from "../DTO/InputFormData";
import * as appAction from "./app.action"; 


export interface State {
  formData: InputFormData | null;
  stationData: any | null;
  trainList: any | null;
}

const initialState: State = {
  formData: null,
  stationData: null,
  trainList: null
};

export const appReducer = createReducer(
  initialState,
  on(appAction.saveFormData, (state, action) => {
    return {...state, formData: action.payload};
  }),
  on(appAction.saveStationData, (state, action) => {
    return {...state, stationData: action.payload }
  }),
  on(appAction.saveTrainList, (state, action) => ({
    ...state,
    trainList: action.payload,
  }))
);



export const selectFormData = (state: State) => state.formData;
export const selectStationData = (state: State) => state.stationData;
export const selectTrainList = (state: State) => state.trainList;