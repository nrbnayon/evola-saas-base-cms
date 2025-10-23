import DashboardCard from './AdminOverview/DashboardCard';
import SectionTitle from '../../components/SectionTitle';
import RevenueCharts from './AdminOverview/RevenueCharts';

const AdminOverview = () => {
  return (
    <div>
      <SectionTitle title={"Admin Overview"} description={"Track, manage and forecast your customers and orders."}/>
      <DashboardCard/>
      <RevenueCharts/>
      
    </div>
  );
};

export default AdminOverview;