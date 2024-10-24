 export const calculateDateRange = (dateRange, startDate, endDate) => {
    const now = new Date();
    let start, end;
  
    switch (dateRange) {
      case "daily":
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "weekly":
        const startOfWeek = now.getDate() - now.getDay(); // Get Sunday of this week
        start = new Date(now.setDate(startOfWeek));
        start.setHours(0, 0, 0, 0);
        end = new Date();
        end.setHours(23, 59, 59, 999);
        break;
      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "yearly":
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      case "custom":
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      default:
        throw new Error("Invalid date range");
    }
  
    return { start, end };
  };
  