import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MDBDataTable } from 'mdbreact'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'

import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import Sidebar from './Sidebar';
import { getAllOrders, deleteOrder } from '../../actions/orderActions';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';

const OrderList = ({ history }) => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { loading, allOrders, error } = useSelector(state => state.getAllOrder);

    const { error: orderError, isDeleted } = useSelector(state => state.order);

    useEffect(() => {

        dispatch(getAllOrders())

        if (isDeleted) {
            alert.success('order deleted successfully')
            history.push('/admin/orders')
            dispatch({ type: DELETE_ORDER_RESET })
        }

        if (orderError) {
            alert.error(orderError)
        }
    }, [dispatch, isDeleted, orderError, alert, history])

    const deleteHandler = (id) => {
        dispatch(deleteOrder(id))
    }

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                }, {
                    label: 'No Of Items',
                    field: 'numOfItems',
                    sort: 'asc'
                }, {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc'
                }, {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc'
                }, {
                    label: 'Action',
                    field: 'actions'
                }
            ],
            rows: []
        }

        allOrders.forEach(order => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: order.totalPrice,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions: <Fragment>
                    <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={(e) => deleteHandler(order._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    return (
        <Fragment>
            <MetaData title={'Order List'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Orders</h1>
                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setOrders()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}
                    </Fragment>

                </div>
            </div>
        </Fragment>
    )
}

export default OrderList;
