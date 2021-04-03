import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData'

import { getOrderDetails, updateOrder, clearErrors } from '../../actions/orderActions';
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants';

const UpdateOrder = ({ match }) => {

    const ordersstatus = [
        'Processing',
        'Shipped',
        'Delivered'
    ]

    const alert = useAlert();
    const dispatch = useDispatch();
    const [status, setStatus] = useState('');

    const { loading, order = {} } = useSelector(state => state.orderDetails)
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order;
    const { error, isUpdated } = useSelector(state => state.order)

    const orderId = match.params.id

    useEffect(() => {
        dispatch(getOrderDetails(match.params.id))

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success('Status updated successfully')
            dispatch({ type: UPDATE_ORDER_RESET })

        }


    }, [dispatch, orderId, isUpdated, alert, error]);

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`

    const isPaid = paymentInfo && paymentInfo.status === 'succeeded' ? true : false;

    const submitUpdateHandler = (e) => {
        e.preventDefault();

        let formData = new FormData();
        console.log('fdsddfsfs', status)
        formData.set('status', status);

        dispatch(updateOrder(orderId, formData))
    }

    return (
        <Fragment>
            <MetaData title={'update Order'} />
            {loading ? <Loader /> : (
                <div className="container container-fluid">

                    <div className="row d-flex justify-content-around">
                        <div className="col-12 col-lg-7 order-details">

                            <h1 className="my-5">Order #{ }</h1>

                            <h4 className="mb-4">Shipping Info</h4>
                            <p><b>Name:</b> {user && user.name}</p>
                            <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                            <p className="mb-4"><b>Address:</b> {shippingDetails}</p>
                            <p><b>Amount:</b> {totalPrice}</p>

                            <hr />

                            <h4 className="my-4">Payment</h4>
                            {isPaid
                                ? <p className="greenColor" ><b>PAID</b></p>
                                : <p className="redColor" ><b>Not PAID</b></p>
                            }
                            <h4 className="my-4">Stripe ID</h4>
                            <p className="greenColor" ><b>stripe_{paymentInfo && paymentInfo.id}</b></p>


                            <h4 className="my-4">Order Status:</h4>
                            {String(order.orderStatus).includes('Delivered')
                                ? <p className='greenColor' ><b>{order.orderStatus}</b></p>
                                : <p className='redColor' ><b>{order.orderStatus}</b></p>}

                            <h4 className="my-4">Order Items:</h4>

                            <hr />
                            <div className="cart-item my-1">
                                {orderItems && orderItems.map(order => {
                                    return <div key={order.product} className="row my-5">
                                        <div className="col-4 col-lg-2">
                                            <img src={order.image} alt={order.name} height="45" width="65" />
                                        </div>

                                        <div className="col-5 col-lg-5">
                                            <Link to="#">{order.name}</Link>
                                        </div>


                                        <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                            <p>{order.price}</p>
                                        </div>

                                        <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                            <p>{order.quantity} Piece(s)</p>
                                        </div>
                                    </div>
                                })}
                            </div>
                            <hr />
                        </div>

                        <div className="col-12 col-lg-3 mt-5">
                            <h4 className="my-4">Status</h4>

                            <div className="form-group">
                                <select
                                    className="form-control"
                                    name='status'
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {ordersstatus.map(status => {
                                        return <option key={status} value={status}>{status}</option>
                                    })}
                                </select>
                            </div>

                            <button
                                className="btn btn-primary btn-block"
                                onClick={submitUpdateHandler}>
                                Update Status
                                       </button>
                        </div>

                    </div>

                </div>
            )}
        </Fragment>
    )
}
export default UpdateOrder;

