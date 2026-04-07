export const electricityPageStyles = `
  .electricity-page {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.85fr);
    gap: 16px;
    padding: 24px;
    border-radius: 24px;
    background:
      radial-gradient(circle at top left, rgba(255, 214, 0, 0.22), transparent 35%),
      linear-gradient(135deg, #102542, #0f4c75 55%, #1b8a5a);
    color: #fff;
    box-shadow: 0 18px 40px rgba(16, 37, 66, 0.22);
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .hero-kicker {
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.78);
  }

  .hero h1 {
    margin: 0;
    font-size: 30px;
    line-height: 1.2;
  }

  .hero p {
    margin: 0;
    max-width: 720px;
    color: rgba(255, 255, 255, 0.86);
    line-height: 1.8;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 8px;
  }

  .hero-side {
    padding: 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .stats-grid,
  .workflow-grid,
  .action-grid,
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }

  .panel-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.9fr);
    gap: 16px;
  }

  .panel,
  .stat-card,
  .workflow-card,
  .action-tile {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  }

  .panel {
    padding: 20px;
  }

  .stat-card {
    padding: 18px;
    border: 1px solid #e6ebf3;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stat-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .stat-head mat-icon {
    width: 42px;
    height: 42px;
    font-size: 42px;
    color: #0f4c75;
  }

  .stat-card strong {
    font-size: 28px;
    color: #102542;
  }

  .stat-card span,
  .muted {
    color: #607d8b;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 18px;
    color: #102542;
  }

  .toolbar-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .search-field {
    min-width: 240px;
    width: min(100%, 380px);
  }

  .table-wrap {
    overflow: auto;
    border-radius: 16px;
    border: 1px solid #edf1f7;
  }

  .data-table {
    width: 100%;
    background: #fff;
  }

  .selected-row {
    background: #eef6ff;
  }

  .metric-list {
    display: grid;
    gap: 10px;
  }

  .metric-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 12px 14px;
    background: #f6f8fb;
    border-radius: 14px;
  }

  .metric-row span {
    color: #546e7a;
  }

  .metric-row strong {
    color: #102542;
  }

  .workflow-card,
  .action-tile {
    padding: 18px;
    border: 1px solid #e5ecf5;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .workflow-card:hover,
  .action-tile:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 34px rgba(15, 23, 42, 0.12);
  }

  .workflow-card mat-icon,
  .action-tile mat-icon {
    color: #0f4c75;
  }

  .legacy-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 999px;
    background: #eff7ff;
    color: #0f4c75;
    font-size: 12px;
    width: fit-content;
  }

  .note-box {
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid #ffe082;
    background: #fff9e8;
    color: #775500;
    line-height: 1.7;
  }

  .empty-state {
    padding: 28px 16px;
    text-align: center;
    color: #78909c;
  }

  .status-pill {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    background: #edf7ed;
    color: #2e7d32;
  }

  .warning-pill {
    background: #fff4e5;
    color: #c96f00;
  }

  .danger-pill {
    background: #ffebee;
    color: #c62828;
  }

  .amount-positive {
    color: #1b8a5a;
    font-weight: 700;
  }

  .amount-negative {
    color: #c62828;
    font-weight: 700;
  }

  @media (max-width: 980px) {
    .hero,
    .panel-grid {
      grid-template-columns: 1fr;
    }
  }
`;
