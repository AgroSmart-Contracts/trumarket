import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../lib/store";

// declaring the types for our state
export type ShipmentAgreementData = {
  formValues: {
    [key: string]: string;
  };
};

const initialState: ShipmentAgreementData = {
  formValues: {},
};

export const shipmentAgreementSlice = createSlice({
  name: "shipmentAgreement",
  initialState,
  reducers: {
    resetShipmentAgreementState: (state: ShipmentAgreementData) => {
      state = initialState;
      return state;
    },
    setShipmentAgreementState: (state: ShipmentAgreementData, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      state.formValues[field] = value;
    },
  },
});

// actions
export const { resetShipmentAgreementState, setShipmentAgreementState } = shipmentAgreementSlice.actions;

// selectors
export const selectShipmentAgreementState = (state: RootState) => state.shipmentAgreement.formValues;

export default shipmentAgreementSlice.reducer;
