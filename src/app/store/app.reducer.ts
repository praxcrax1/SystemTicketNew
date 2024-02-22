import { createReducer, on } from "@ngrx/store";
import { InputFormData } from "../DTO/InputFormData";
import * as appAction from "./app.action"; 


export interface State {
  formData: InputFormData | null;
}

const initialState: State = {
  formData: null,
};

export const appReducer = createReducer(
  initialState,
  on(appAction.saveFormData, (state, action) => {
    console.log('Reducer - saveFormData action:', action);
    console.log('Reducer - Form Data:', action.payload);
    return {...state, formData: action.payload};
  }));



export const selectFormData = (state: State) => state.formData;
