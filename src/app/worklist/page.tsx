'use client';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { createStyles } from 'antd-style';
import { FileText, Search } from 'lucide-react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    height: 100vh;
    background: ${token.colorBgLayout};
    display: flex;
    flex-direction: column;
  `,
  header: css`
    padding: ${token.paddingLG}px ${token.paddingXL}px;
    background: ${token.colorBgContainer};
    border-bottom: 1px solid ${token.colorBorder};
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
    border-bottom: 1px solid ${token.colorBorder};
  `,
  searchInput: css`
    width: 100%;
    max-width: 600px;
    padding: ${token.paddingSM}px ${token.paddingMD}px;
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    font-size: 14px;
    background: ${token.colorBgContainer};
    color: ${token.colorText};

    &:focus {
      outline: none;
      border-color: ${token.colorPrimary};
    }
  `,
  tableContainer: css`
    flex: 1;
    overflow: auto;
    padding: ${token.paddingLG}px;
  `,
  patientCell: css`
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
  `,
  patientIcon: css`
    width: 32px;
    height: 32px;
    border-radius: ${token.borderRadius}px;
    background: ${token.colorPrimaryBg};
    color: ${token.colorPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  `,
  patientInfo: css`
    display: flex;
    flex-direction: column;
  `,
  patientName: css`
    font-weight: 500;
    color: ${token.colorText};
  `,
  patientId: css`
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,
}));

interface Report {
  key: string;
  patientName: string;
  patientId: string;
  examType: string;
  examDate: string;
  status: string;
  doctor: string;
}

// Mock data - will be replaced with real data from database
const mockReports: Report[] = [
  {
    key: '1',
    patientName: 'Dupont Marie',
    patientId: '12345',
    examType: 'IRM Cérébrale',
    examDate: '2024-01-15',
    status: 'Signé',
    doctor: 'Dr. Martin',
  },
  {
    key: '2',
    patientName: 'Bernard Jean',
    patientId: '12346',
    examType: 'TDM Thoracique',
    examDate: '2024-01-14',
    status: 'Signé',
    doctor: 'Dr. Martin',
  },
  {
    key: '3',
    patientName: 'Moreau Sophie',
    patientId: '12347',
    examType: 'Échographie Abdominale',
    examDate: '2024-01-14',
    status: 'Signé',
    doctor: 'Dr. Martin',
  },
  {
    key: '4',
    patientName: 'Lefebvre Paul',
    patientId: '12348',
    examType: 'Radiographie Thorax',
    examDate: '2024-01-13',
    status: 'Signé',
    doctor: 'Dr. Dubois',
  },
  {
    key: '5',
    patientName: 'Garnier Claire',
    patientId: '12349',
    examType: 'IRM Lombaire',
    examDate: '2024-01-13',
    status: 'Signé',
    doctor: 'Dr. Martin',
  },
];

export default function WorklistPage() {
  const { styles } = useStyles();

  const columns: ColumnsType<Report> = [
    {
      title: 'Patient',
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
      render: (_, record) => (
        <div className={styles.patientCell}>
          <div className={styles.patientIcon}>
            <FileText size={16} />
          </div>
          <div className={styles.patientInfo}>
            <span className={styles.patientName}>{record.patientName}</span>
            <span className={styles.patientId}>ID: {record.patientId}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Type d'Examen",
      dataIndex: 'examType',
      key: 'examType',
      sorter: (a, b) => a.examType.localeCompare(b.examType),
    },
    {
      title: 'Date',
      dataIndex: 'examDate',
      key: 'examDate',
      sorter: (a, b) => a.examDate.localeCompare(b.examDate),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span
          style={{
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            background: '#f6ffed',
            color: '#52c41a',
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: 'Médecin',
      dataIndex: 'doctor',
      key: 'doctor',
    },
  ];

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

      <div className={styles.tableContainer}>
        <Table
          columns={columns}
          dataSource={mockReports}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </div>
    </Flexbox>
  );
}
