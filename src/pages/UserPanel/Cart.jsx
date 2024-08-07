import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import myContext from "../../components/context";
import { useDispatch, useSelector } from "react-redux";
import {
  removeCart,
  updateQuantity,
  updateTotal,
} from "../../Redux/features/cart/cartSlice";
import { updateCartAsync } from "../../Redux/thunk/thunk";
export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state)=> state.cart.total)
  const [open, setOpen] = useState(true);
  const { isLoggedIn } = useContext(myContext);
  const navigate = useNavigate();
  const loged = localStorage.getItem("credentials");

  useEffect(() => {
    if (!loged) {
      navigate("/");
    }
  }, []);

  const removerEvent = (productId) => {
    dispatch(removeCart(productId));
    dispatch(updateCartAsync())
  };

  const handleQuantity = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, newQuantity }));
    dispatch(updateCartAsync())

  };

  useEffect(() => {
    dispatch(updateTotal())

  }, [cart]);

  // const updateCartOnServer = async (updatedCart) => {
  //   try {
  //     await axios.patch(`http://localhost:8000/users/${id}`, {
  //       cart: updatedCart,
  //     });
  //   } catch (error) {
  //     console.error("Error updating cart data:", error);
  //   }
  // };

  return (
    <div>
      <Transition show={open}>
        <Dialog className="relative z-10 " onClose={() => navigate("/shop")}>
          <TransitionChild
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity " />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <DialogTitle className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </DialogTitle>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => navigate("/shop")}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {cart.map((product) => (
                                <li key={product.id} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img
                                      src={product.imageSrc}
                                      alt={product.imageAlt}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900">
                                        <h3>
                                          <a href={product.href}>
                                            {product.name}
                                          </a>
                                        </h3>
                                        <p className="ml-4 w-20">
                                          <span className="text-gray-500 text-xs">
                                            ({product.quantity} x{" "}
                                            {product.price}){" "}
                                          </span>{" "}
                                          ${product.price * product.quantity}
                                        </p>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        {product.color}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                      <div>
                                        <button
                                          className="border px-2"
                                          onClick={() =>
                                            handleQuantity(
                                              product.id,
                                              Math.max(product.quantity - 1, 1)
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <span className="m-1">
                                          {product.quantity}
                                        </span>
                                        <button
                                          className="border px-2"
                                          onClick={() =>
                                            handleQuantity(
                                              product.id,
                                              product.quantity + 1
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>

                                      <div className="flex">
                                        <button
                                          type="button"
                                          className="font-medium text-indigo-600 hover:text-indigo-500"
                                          onClick={() =>
                                            removerEvent(product.id)
                                          }
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      {cart.length > 0 ? (
                        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>${total}</p>
                          </div>
                          <p className="mt-0.5 text-sm text-gray-500">
                            Shipping and taxes calculated at checkout.
                          </p>
                          <div className="mt-6">
                            <Link
                              to={"/checkout"}
                              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                            >
                              Checkout
                            </Link>
                          </div>
                          <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                            <p>
                              or{" "}
                              <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => navigate("/shop")}
                              >
                                Continue Shopping
                                <span aria-hidden="true"> &rarr;</span>
                              </button>
                            </p>
                          </div>
                        </div>
                      ) : (
                        <h3 className="mb-96 font-bold text-red-500 text-4xl mx-auto">
                          Your Cart Is Empty!
                        </h3>
                      )}
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
