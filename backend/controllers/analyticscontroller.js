import {User} from "../models/usermodel.js";



export const getanalyticsdata =async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesdata = await Order.aggregate([
      {
        $group: {
          _id: null,  //it groups all document together
          totalSales: { $sum:1 },
          totalrevenue: { $sum: "$totalAmount" }
        }
      }
    ])
const {totalSales,totalrevenue} = salesdata[0] || {};

return{users: totalUsers,
  products: totalProducts,
  sales: totalSales,
  revenue: totalrevenue};

  } catch (error) {}
};

export const getdailysalesdata =async (startdate, enddate) => {

const dailysalesdata = await Order.aggregate([
  {
    $match: {
      createdAt: { $gte: startdate, $lt: enddate }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      totalSales: { $sum: 1 },
      totalRevenue: { $sum: "$totalAmount" }
    }
  },
  {
    $sort: {
      _id: 1
    }
  },

]);
const datearray = getdatesinrange(startdate, enddate);


return datearray.map(date => {
  const dailySales = dailysalesdata.find(sales => sales._id === date);
  return{
    date,
    sales: dailySales?.sales ||  0,
    revenue: dailySales?.totalRevenue || 0
  }
});

}

function getdatesinrange(startdate, enddate) {
  const currentdate = new Date(startdate.getTime());
  const dates = [];
  
  while(enddate => currentdate){
    dates.push(currentdate.toISOString().split("T")[0]);
    currentdate.setDate(currentdate.getDate() + 1);

    return dates;
  }


};

