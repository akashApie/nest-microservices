"use strict";
exports.id = 829;
exports.ids = [829];
exports.modules = {

/***/ 7829:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LV: () => (/* binding */ createOrder),
/* harmony export */   fA: () => (/* binding */ fetchOrdersByCustomerId),
/* harmony export */   pB: () => (/* binding */ fetchCustomerById),
/* harmony export */   t2: () => (/* binding */ fetchProducts),
/* harmony export */   wK: () => (/* binding */ createCustomer)
/* harmony export */ });
/* unused harmony exports fetchProductById, fetchCustomers, fetchOrders, fetchOrderById */
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9648);
/* harmony import */ var react_hot_toast__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6201);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_0__, react_hot_toast__WEBPACK_IMPORTED_MODULE_1__]);
([axios__WEBPACK_IMPORTED_MODULE_0__, react_hot_toast__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);


const CUSTOMER_API_URL = "http://localhost:3000";
const PRODUCT_API_URL = "http://localhost:3001";
// Create Axios instances with default config
const customerApi = axios__WEBPACK_IMPORTED_MODULE_0__["default"].create({
    baseURL: CUSTOMER_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});
const productApi = axios__WEBPACK_IMPORTED_MODULE_0__["default"].create({
    baseURL: PRODUCT_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});
// Error handler
const handleApiError = (error)=>{
    if (axios__WEBPACK_IMPORTED_MODULE_0__["default"].isAxiosError(error)) {
        const axiosError = error;
        const errorMessage = axiosError.response?.data?.message || axiosError.message || "An error occurred";
        console.error("API Error:", errorMessage);
        react_hot_toast__WEBPACK_IMPORTED_MODULE_1__["default"].error(errorMessage);
        throw new Error(errorMessage);
    }
    console.error("Unexpected error:", error);
    react_hot_toast__WEBPACK_IMPORTED_MODULE_1__["default"].error("An unexpected error occurred");
    throw error;
};
// Products API
const fetchProducts = async ()=>{
    try {
        const response = await productApi.get("/products");
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
const fetchProductById = async (id)=>{
    try {
        const response = await productApi.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
// Customers API
const fetchCustomers = async ()=>{
    try {
        const response = await customerApi.get("/customers");
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
const fetchCustomerById = async (id)=>{
    try {
        const response = await customerApi.get(`/customers/${id}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
const createCustomer = async (customer)=>{
    try {
        const response = await customerApi.post("/customers", customer);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
// Orders API
const fetchOrders = async ()=>{
    try {
        const response = await productApi.get("/orders");
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
const fetchOrdersByCustomerId = async (customerId)=>{
    try {
        const response = await productApi.get(`/orders/customer/${customerId}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
const fetchOrderById = async (id)=>{
    try {
        const response = await productApi.get(`/orders/${id}`);
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};
const createOrder = async (customerId, items)=>{
    try {
        // Transform cart items to order items
        const orderItems = items.map((item)=>({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price
            }));
        const response = await productApi.post("/orders", {
            customerId,
            items: orderItems,
            status: "pending"
        });
        return response.data;
    } catch (error) {
        return handleApiError(error);
    }
};

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;