import {
  createResponse,
  serverErrorResponse,
} from "../../helpers/responseHandler.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import Category from "../../models/category.model.js";

const getAdminDashboard = async (req, res) => {
  const { filter } = req.query;

  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-indexed month
    console.log(currentMonth);

    if (filter === "yearly") {
      // Aggregate sales data by month
      const monthlySales = await Order.aggregate([
        {
          $match: {
            $and: [
              { status: { $in: ["Delivered", "Confirmed", "Shipped"] } },
              { $expr: { $eq: [{ $year: "$orderDate" }, currentYear] } },
            ],
          },
        },
        {
          $group: {
            _id: { month: { $month: "$orderDate" } },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);

      const totalOrders = await Order.countDocuments({
        status: { $in: ["Confirmed", "Delivered", "Shipped"] },
      });

      // Prepare all months with sales initialized to 0
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const MonthlySales = monthNames.map((name, index) => ({
        field: name,
        sales:
          monthlySales
            .find((sale) => sale._id.month === index + 1)
            ?.totalAmount.toFixed(0) || 0,
      }));

      console.log("Monthly", MonthlySales);
      console.log("monthly", monthlySales);
      const totalSales = MonthlySales.reduce(
        (acc, sales) => acc + Number(sales.sales),
        0
      );

      return createResponse(
        res,
        200,
        true,
        "Yearly Sales Data Retrieved Successfully",
        { sales: MonthlySales, totalSales, totalOrders }
      );
    } else if (filter === "monthly") {
      // Aggregate sales data by day for the current month
      const dailySales = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $month: "$orderDate" }, currentMonth] },
                { $eq: [{ $year: "$orderDate" }, currentYear] },
                { $in: ["$status", ["Delivered", "Confirmed", "Shipped"]] }, // Moved status inside $expr
              ],
            },
          },
        },
        {
          $group: {
            _id: { day: { $dayOfMonth: "$orderDate" } },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
        { $sort: { "_id.day": 1 } },
      ]);

      // Create an array for all days of the month (1 to 31)
      const DailySales = Array.from({ length: 31 }, (_, i) => ({
        field: `${i + 1}`,
        sales:
          dailySales
            .find((sale) => sale._id.day === i + 1)
            ?.totalAmount.toFixed(0) || 0,
      }));
      console.log("Daily", DailySales);
      console.log("daily", dailySales);
      const totalSales = DailySales.reduce(
        (acc, sales) => acc + Number(sales.sales),
        0
      );
      const totalOrders = await Order.countDocuments({
        status: { $in: ["Confirmed", "Delivered", "Shipped"] },
      });
      return createResponse(
        res,
        200,
        true,
        "Monthly Sales Date Retrieved Successfully",
        {
          month: currentMonth,
          year: currentYear,
          sales: DailySales,
          totalSales,
          totalOrders,
        }
      );
    }

    res.json({ message: "Invalid filter" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching sales data" });
  }
};

const bestSellingProducts = async (req, res) => {
  try {
    const products = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: { productName: "$items.productName" },
          sum: { $sum: 1 },
        },
      },
      { $sort: { sum: -1 } },
    ]);

    if (products.length === 0) {
      return createResponse(res, 404, "No products found");
    }
    console.log(products);
    return createResponse(
      res,
      200,
      true,
      "Best selling products retrieved successfully",
      products
    );
  } catch (error) {
    return serverErrorResponse(res);
  }
};

const bestSellingCategories = async (req, res) => {
  try {
    const categories = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: { categoryName: "$items.categoryName" },
          sum: { $sum: 1 },
        },
      },
      { $sort: { sum: -1 } },
    ]);

    if (categories.length === 0) {
      return createResponse(res, 404, "No products found");
    }
    console.log(categories);
    return createResponse(
      res,
      200,
      true,
      "Best selling products retrieved successfully",
      categories
    );
  } catch (error) {
    return serverErrorResponse(res);
  }
};

export { getAdminDashboard, bestSellingProducts, bestSellingCategories };
