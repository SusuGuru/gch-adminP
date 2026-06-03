export default function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <span>{title}</span>

        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <h2>{value}</h2>
    </div>
  );
}