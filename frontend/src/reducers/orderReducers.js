import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAIL,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAIL_REQUEST,
    ORDER_DETAIL_SUCCESS,
    ORDER_DETAIL_FAIL,
    CLEAR_ERRORS,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    DELETE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    DELETE_ORDER_RESET,
    UPDATE_ORDER_RESET,
} from '../constants/orderConstants';
import { UPDATE_PRODUCT_FAIL } from '../constants/productConstants';

export const newOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true
            }
        case CREATE_ORDER_SUCCESS:
            return {
                loading: false,
                order: action.payload
            }
        case CREATE_ORDER_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}


export const myOrderReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case MY_ORDERS_REQUEST:
            return {
                loading: true
            }
        case MY_ORDERS_SUCCESS:
            return {
                loading: false,
                orders: action.payload
            }
        case MY_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const orderDetailsReducer = (state = { order: {} }, action) => {
    switch (action.type) {
        case ORDER_DETAIL_REQUEST:
            return {
                loading: true
            }
        case ORDER_DETAIL_SUCCESS:
            return {
                loading: false,
                order: action.payload
            }
        case ORDER_DETAIL_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const getAllOrderReducer = (state = { allOrders: [] }, action) => {
    switch (action.type) {
        case ALL_ORDERS_REQUEST:
            return {
                loading: true
            }
        case ALL_ORDERS_SUCCESS:
            return {
                loading: false,
                allOrders: action.payload
            }
        case ALL_ORDERS_FAIL:
            return {
                loading: false,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state
    }
}

export const orderReducer = (state = {}, action) => {

    switch (action.type) {
        case UPDATE_ORDER_REQUEST:
        case DELETE_ORDER_REQUEST:
            return {
                ...state,
                loading: true

            }
        case UPDATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }
        case DELETE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }
        case UPDATE_PRODUCT_FAIL:
        case DELETE_ORDER_FAIL:
            return {
                ...state,
                error: action.payload
            }
        case DELETE_ORDER_RESET:
            return {
                ...state,
                isDeleted: false
            }
        case UPDATE_ORDER_RESET:
            return {
                ...state,
                isUpdated: false
            }
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }
        default:
            return state;
    }
}
