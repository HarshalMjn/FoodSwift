import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import axios from "axios";
import { useState } from 'react';

export default function Cart() {
  const [myOrders, setMyOrders] = useState([]);
  let data = useCart();
  let dispatch = useDispatchCart();
  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3'>The Cart is Empty!</div>
      </div>
    )
  }
  // const handleRemove = (index)=>{
  //   console.log(index)
  //   dispatch({type:"REMOVE",index:index})
  // }

  // const handleCheckOut = async () => {
  //   let userEmail = localStorage.getItem("userEmail");
  //   // console.log(data,localStorage.getItem("userEmail"),new Date())
  //   let response = await fetch("http://localhost:5000/orderData", {
  //     // credentials: 'include',
  //     // Origin:"http://localhost:3000/login",
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       order_data: data,
  //       email: userEmail,
  //       order_date: new Date().toDateString()
  //     })
  //   });
  //   console.log("JSON RESPONSE:::::", response.status)
  //   if (response.status === 200) {
  //     dispatch({ type: "DROP" })
  //   }
  // }

  const fetchMyOrders = async () => {
    try {
      const response = await axios.post("http://localhost:5000/myOrderData", { email: localStorage.getItem("userEmail") });
      setMyOrders(response.data.orderData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const orderUrl = "http://localhost:5000/api/payment/orders";
      const {data} = await axios.post(orderUrl, {amount:totalPrice});
      console.log(data);
      initPayment(data.data)
      

    } catch(error) {

    }
    
  }

  const initPayment = (data) => {
    const options = {
      key : "rzp_test_ju1RtRmAqH3Y6B",
      amount:data.amount,
      currency:data.currency,
     
      description:"Test Transaction",
      order_id:data.id,
      handler: async (response) => {
        try {
            const verifyUrl = "http://localhost:5000/api/payment/verify";
            const {data} = await axios.post(verifyUrl, response);
            console.log(data);
            dispatch({ type: "DROP" });
            fetchMyOrders();
        } catch(error) {
          console.log(error);
        }
      },
      theme: {
        color:"3399c",
      }
      

    };
    const  rzp1 = new window.Razorpay(options);
    rzp1.open();
   

    
  }

  let totalPrice = data.reduce((total, food) => total + food.price, 0)
  return (
    <div>

      {console.log(data)}
      <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md' >
        <table className='table table-hover '>
          <thead className=' text-success fs-4'>
            <tr>
              <th scope='col' >#</th>
              <th scope='col' >Name</th>
              <th scope='col' >Quantity</th>
              <th scope='col' >Option</th>
              <th scope='col' >Amount</th>
              <th scope='col' ></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr>
                <th scope='row' >{index + 1}</th>
                <td >{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td ><button type="button" className="btn p-0"><DeleteIcon onClick={() => { dispatch({ type: "REMOVE", index: index }) }} /></button> </td></tr>
            ))}
          </tbody>
        </table>
        <div><h1 className='fs-2'>Total Price: {totalPrice}/-</h1></div>
        <div>
          <button className='btn bg-success mt-5 ' onClick={handleCheckOut} > Check Out </button>
        </div>
      </div>



    </div>
  )
}