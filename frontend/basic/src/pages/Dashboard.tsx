import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import '../styles/dashboard.scss';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

const MetricCard = ({ title, value, change, isPositive, icon }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <div className="metric-icon">
        <span className="material-icons">{icon}</span>
      </div>
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <p className="metric-value">{value}</p>
        <p className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
          <span className="material-icons">
            {isPositive ? 'arrow_upward' : 'arrow_downward'}
          </span>
          {change}
        </p>
      </div>
    </div>
  );
};

interface PatentCardProps {
  title: string;
  number: string;
  applicant: string;
  date: string;
  status: string;
}

const PatentCard = ({ title, number, applicant, date, status }: PatentCardProps) => {
  return (
    <div className="patent-card">
      <div className="patent-header">
        <h3 className="patent-title">{title}</h3>
        <span className={`patent-status ${status.toLowerCase()}`}>{status}</span>
      </div>
      <div className="patent-details">
        <div className="detail-item">
          <span className="label">Patent No:</span>
          <span className="value">{number}</span>
        </div>
        <div className="detail-item">
          <span className="label">Applicant:</span>
          <span className="value">{applicant}</span>
        </div>
        <div className="detail-item">
          <span className="label">Filing Date:</span>
          <span className="value">{date}</span>
        </div>
      </div>
      <div className="patent-actions">
        <button className="action-btn">
          <span className="material-icons">visibility</span>
          View
        </button>
        <button className="action-btn">
          <span className="material-icons">add_to_photos</span>
          Add to Collection
        </button>
        <button className="action-btn">
          <span className="material-icons">share</span>
          Share
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const metrics = [
    {
      title: 'Recent Searches',
      value: '24',
      change: '3 new (24h)',
      isPositive: true,
      icon: 'search',
    },
    {
      title: 'Saved Patents',
      value: '137',
      change: '12 new (7d)',
      isPositive: true,
      icon: 'article',
    },
    {
      title: 'Collections',
      value: '8',
      change: '1 new (7d)',
      isPositive: true,
      icon: 'folder',
    },
    {
      title: 'Alerts',
      value: '5',
      change: '3 new alerts',
      isPositive: false,
      icon: 'notifications',
    },
  ];

  const recentPatents = [
    {
      title: 'System and Method for Neural Network Based Image Recognition',
      number: 'US10956727B2',
      applicant: 'Tech Innovations Inc.',
      date: '2021-03-23',
      status: 'Active',
    },
    {
      title: 'Blockchain-Based Secure Communication Protocol',
      number: 'US11234567B2',
      applicant: 'SecureChain Systems',
      date: '2021-05-15',
      status: 'Pending',
    },
    {
      title: 'Autonomous Vehicle Navigation System',
      number: 'US10789543B2',
      applicant: 'AutoDrive Technologies',
      date: '2020-09-29',
      status: 'Active',
    },
    {
      title: 'Method for Quantum Encryption in Telecommunications',
      number: 'US11876543B2',
      applicant: 'Quantum Communications Inc.',
      date: '2021-06-10',
      status: 'Pending',
    },
  ];

  const recentSearches = [
    {
      query: 'artificial intelligence image recognition',
      date: '2023-06-18',
      results: 324,
    },
    {
      query: 'blockchain security protocols',
      date: '2023-06-15',
      results: 187,
    },
    {
      query: 'autonomous vehicle navigation',
      date: '2023-06-12',
      results: 412,
    },
    {
      query: 'quantum encryption communication',
      date: '2023-06-10',
      results: 98,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
        <p className="date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            isPositive={metric.isPositive}
            icon={metric.icon}
          />
        ))}
      </div>

      <div className="dashboard-row">
        <div className="patent-activity-section">
          <div className="section-header">
            <h2>Your Patent Activity</h2>
            <div className="time-filters">
              <button className="time-filter active">Week</button>
              <button className="time-filter">Month</button>
              <button className="time-filter">Quarter</button>
              <button className="time-filter">Year</button>
            </div>
          </div>
          <div className="chart-placeholder">
            <div className="placeholder-text">Patent Activity Chart</div>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="recent-patents-section">
          <div className="section-header">
            <h2>Recently Viewed Patents</h2>
            <button className="view-all">View All</button>
          </div>
          <div className="patents-grid">
            {recentPatents.map((patent, index) => (
              <PatentCard
                key={index}
                title={patent.title}
                number={patent.number}
                applicant={patent.applicant}
                date={patent.date}
                status={patent.status}
              />
            ))}
          </div>
        </div>

        <div className="recent-searches-section">
          <div className="section-header">
            <h2>Recent Searches</h2>
            <button className="view-all">View All</button>
          </div>
          <div className="searches-list">
            <table>
              <thead>
                <tr>
                  <th>Query</th>
                  <th>Date</th>
                  <th>Results</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentSearches.map((search, index) => (
                  <tr key={index}>
                    <td className="search-query">{search.query}</td>
                    <td>{new Date(search.date).toLocaleDateString()}</td>
                    <td>{search.results}</td>
                    <td className="actions">
                      <button className="icon-btn" title="Run Again">
                        <span className="material-icons">replay</span>
                      </button>
                      <button className="icon-btn" title="Edit Search">
                        <span className="material-icons">edit</span>
                      </button>
                      <button className="icon-btn" title="Save Search">
                        <span className="material-icons">bookmark</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 