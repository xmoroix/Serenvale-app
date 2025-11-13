'use client';

import { createStyles } from 'antd-style';
import { FileText, Search } from 'lucide-react';
import { Center, Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    height: 100vh;
    background: ${token.colorBgLayout};
  `,
  header: css`
    padding: ${token.paddingLG}px ${token.paddingXL}px;
    background: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  title: css`
    font-size: 24px;
    font-weight: 600;
    color: ${token.colorText};
    margin: 0;
  `,
  searchBar: css`
    padding: ${token.paddingMD}px ${token.paddingXL}px;
    background: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorderSecondary};
  `,
  searchInput: css`
    width: 100%;
    max-width: 600px;
    padding: ${token.paddingSM}px ${token.paddingMD}px;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: ${token.colorPrimary};
    }
  `,
  content: css`
    flex: 1;
    overflow-y: auto;
    padding: ${token.paddingLG}px;
  `,
  reportsGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: ${token.marginMD}px;
    max-width: 1400px;
    margin: 0 auto;
  `,
  reportCard: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadiusLG}px;
    padding: ${token.paddingLG}px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: ${token.colorPrimary};
      box-shadow: ${token.boxShadowSecondary};
      transform: translateY(-2px);
    }
  `,
  reportHeader: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
    margin-bottom: ${token.marginMD}px;
  `,
  reportIcon: css`
    width: 40px;
    height: 40px;
    border-radius: ${token.borderRadius}px;
    background: ${token.colorPrimaryBg};
    color: ${token.colorPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  reportTitle: css`
    font-size: 16px;
    font-weight: 600;
    color: ${token.colorText};
    margin: 0;
  `,
  reportMeta: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
    margin-top: 4px;
  `,
  reportDetails: css`
    margin-top: ${token.marginMD}px;
    padding-top: ${token.marginMD}px;
    border-top: 1px solid ${token.colorBorderSecondary};
  `,
  reportRow: css`
    display: flex;
    justify-content: space-between;
    margin-bottom: ${token.marginXS}px;
    font-size: 13px;
  `,
  reportLabel: css`
    color: ${token.colorTextSecondary};
  `,
  reportValue: css`
    color: ${token.colorText};
    font-weight: 500;
  `,
  emptyState: css`
    text-align: center;
    padding: ${token.paddingXL * 3}px;
    color: ${token.colorTextSecondary};
  `,
  emptyIcon: css`
    font-size: 64px;
    margin-bottom: ${token.marginLG}px;
    opacity: 0.3;
  `,
}));

// Mock data - will be replaced with real data from database
const mockReports = [
  {
    id: '1',
    patientName: 'Dupont Marie',
    patientId: '12345',
    examType: 'IRM Cérébrale',
    examDate: '2024-01-15',
    status: 'Signé',
    doctor: 'Dr. Martin',
  },
  {
    id: '2',
    patientName: 'Bernard Jean',
    patientId: '12346',
    examType: 'TDM Thoracique',
    examDate: '2024-01-14',
    status: 'Signé',
    doctor: 'Dr. Martin',
  },
  {
    id: '3',
    patientName: 'Moreau Sophie',
    patientId: '12347',
    examType: 'Échographie Abdominale',
    examDate: '2024-01-14',
    status: 'Signé',
    doctor: 'Dr. Martin',
  },
];

export default function WorklistPage() {
  const { styles } = useStyles();

  return (
    <Flexbox className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>📋 Rapports Terminés</h1>
      </div>

      <div className={styles.searchBar}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Rechercher par nom de patient, numéro, ou type d'examen..."
            className={styles.searchInput}
          />
          <Search
            size={18}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.5,
            }}
          />
        </div>
      </div>

      <div className={styles.content}>
        {mockReports.length > 0 ? (
          <div className={styles.reportsGrid}>
            {mockReports.map((report) => (
              <div key={report.id} className={styles.reportCard}>
                <div className={styles.reportHeader}>
                  <div className={styles.reportIcon}>
                    <FileText size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 className={styles.reportTitle}>{report.patientName}</h3>
                    <div className={styles.reportMeta}>
                      {report.examType} • {report.examDate}
                    </div>
                  </div>
                </div>

                <div className={styles.reportDetails}>
                  <div className={styles.reportRow}>
                    <span className={styles.reportLabel}>Patient ID:</span>
                    <span className={styles.reportValue}>{report.patientId}</span>
                  </div>
                  <div className={styles.reportRow}>
                    <span className={styles.reportLabel}>Statut:</span>
                    <span className={styles.reportValue}>{report.status}</span>
                  </div>
                  <div className={styles.reportRow}>
                    <span className={styles.reportLabel}>Médecin:</span>
                    <span className={styles.reportValue}>{report.doctor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Center className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h3>Aucun rapport terminé</h3>
            <p>Les rapports signés apparaîtront ici</p>
          </Center>
        )}
      </div>
    </Flexbox>
  );
}
