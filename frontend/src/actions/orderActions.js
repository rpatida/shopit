import axios from 'axios';
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
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL
} from '../constants/orderConstants';

export const createOrder = (order) => async (dispatch, getState) => {
    try {

        dispatch({ type: CREATE_ORDER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/v1/order/new', order, config)

        dispatch({
            type: CREATE_ORDER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CREATE_ORDER_FAIL,
            payload: error.response.data.errMessage
        })
    }
}

//get logged inuser orders
export const myOrders = () => async (dispatch) => {
    try {

        dispatch({ type: MY_ORDERS_REQUEST })

        const { data } = await axios.get('/api/v1/orders/me')

        dispatch({
            type: MY_ORDERS_SUCCESS,
            payload: data.orders
        })

    } catch (error) {
        console.log(error)
        dispatch({
            type: MY_ORDERS_FAIL,
            payload: error.response.data.errMessage
        })
    }
}

//get order details inuser orders
export const getOrderDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: ORDER_DETAIL_REQUEST })

        const { data } = await axios.get(`/api/v1/order/${id}`)

        dispatch({
            type: ORDER_DETAIL_SUCCESS,
            payload: data.order
        })

    } catch (error) {
        console.log(error)
        dispatch({
            type: ORDER_DETAIL_FAIL,
            payload: error.response.data.errMessage
        })
    }
}

//get all order details inuser orders
export const getAllOrders = () => async (dispatch) => {
    try {

        dispatch({ type: ALL_ORDERS_REQUEST })

        const { data } = await axios.get('/api/v1/admin/orders')

        dispatch({
            type: ALL_ORDERS_SUCCESS,
            payload: data.orders
        })

    } catch (error) {
        dispatch({
            type: ALL_ORDERS_FAIL,
            payload: error.response.data.errMessage
        })
    }
}


//get all order details inuser orders
export const deleteOrder = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_ORDER_REQUEST })

        const { data } = await axios.delete(`/api/v1/admin/order/${id}`)

        dispatch({
            type: DELETE_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_ORDER_FAIL,
            payload: error.response.data.errMessage
        })
    }
}

export const updateOrder = (orderId,orderData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_ORDER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/v1/admin/order/${orderId}`, orderData, config)

        dispatch({
            type: UPDATE_ORDER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_FAIL,
            payload: error.response.data.errMessage
        })
    }
}


//clear all error
export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}