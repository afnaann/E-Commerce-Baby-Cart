import React from "react";
import { ErrorMessage, useFormik, yupToFormErrors } from "formik";
import * as Yup from "yup";
import "./Registation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Registation = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cart: [],
      orders:[]
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "Must be 15 Characters or less!")
        .required("Name is Required"),
      email: Yup.string()
        .email("Invalid Email Address")
        .required("Email is Required"),
      password: Yup.string()
        // .min(8, "Password must be at least 8 characters")
        // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        // .matches(/[0-9]/, "Password must contain at least one number")
        .required("Password is Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Password Does Not Match")
        .required("Must Confirm Password"),
    }),
    onSubmit: (values) => {
      console.log(values);
      axios.get("http://localhost:8000/users")
      .then((res) => {
        const datas = res.data;
        // console.log(datas);
        const doesMailExists = datas.find(
          (user) => user.email === values.email
        );
        // console.log(doesMailExists)
        if (doesMailExists) {
          toast.error("This Email Already Exists!");
        } else {
          axios
            .post("http://localhost:8000/users", values)
            .then((res) => {
              toast.success("Registered Successfully! ");
              navigate("/login");
            })
            .catch((err) => {
              toast.error("Failed " + err.message);
            });
        }
      });
    },
  });
  return (
    <div
      className="h-screen bg-indigo-50 w-full flex justify-center items-center"
      id="color"
    >
      <div className="bg-indigo-100 p-6 py-8 shadow-xl rounded-xl lg:px-16">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <h1 className="font-medium">SIGNUP!</h1>
          <div>
            <div className="flex">
              <label
                className="mb-1 text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Name:{" "}
              </label>
            </div>
            <input
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="name"
              type="text"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name ? (
              <p className="mt-1 text-sm text-orange-600">
                {formik.errors.name}
              </p>
            ) : null}
          </div>
          <div>
            <div className="flex">
              <label
                className="mb-1 text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Email:{" "}
              </label>
            </div>
            <input
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="email"
              type="text"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.id && formik.errors.id ? (
              <p className="mt-1 text-sm text-orange-600">{formik.errors.id}</p>
            ) : null}
          </div>
          <div>
            <div className="flex">
              <label
                className="mb-1 text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Password:{" "}
              </label>
            </div>
            <input
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="mt-1 text-sm text-orange-600">
                {formik.errors.password}
              </p>
            ) : null}
          </div>
          <div>
            <div className="flex">
              <label
                className="mb-1 text-sm font-medium text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirm Password:
              </label>
            </div>
            <input
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="mt-1 text-sm text-orange-600">
                {formik.errors.confirmPassword}
              </p>
            ) : null}
          </div>
          <div className="flex justify-center mt-1">
            <button
              type="submit"
              className="bg-white hover:bg-blue-100 text-black font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
          <div>
            <p className="text-gray-500">
              Already Have an Account?
              <span className="text-black" onClick={() => navigate("/login")}>
                {" "}
                Go to Login
              </span>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registation;
