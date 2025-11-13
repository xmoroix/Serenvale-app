'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { createStyles } from 'antd-style';
import { ArrowUpDown, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
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
  table: css`
    width: 100%;
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    border: 1px solid ${token.colorBorder};
    border-collapse: separate;
    border-spacing: 0;
  `,
  thead: css`
    background: ${token.colorBgContainerDisabled};
    position: sticky;
    top: 0;
    z-index: 1;
  `,
  th: css`
    padding: ${token.paddingMD}px ${token.paddingLG}px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
    color: ${token.colorTextSecondary};
    border-bottom: 1px solid ${token.colorBorder};
    white-space: nowrap;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: ${token.colorBgTextHover};
    }

    &:first-child {
      border-top-left-radius: ${token.borderRadiusLG}px;
    }

    &:last-child {
      border-top-right-radius: ${token.borderRadiusLG}px;
    }
  `,
  tr: css`
    &:hover {
      background: ${token.colorBgTextHover};
    }
  `,
  td: css`
    padding: ${token.paddingMD}px ${token.paddingLG}px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    font-size: 14px;
    color: ${token.colorText};
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
  statusBadge: css`
    padding: 4px 12px;
    border-radius: ${token.borderRadiusSM}px;
    font-size: 12px;
    font-weight: 500;
    background: ${token.colorSuccessBg};
    color: ${token.colorSuccess};
    display: inline-block;
  `,
  sortIcon: css`
    display: inline-flex;
    align-items: center;
    gap: 4px;
  `,
}));

interface Report {
  id: string;
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
  {
    id: '4',
    patientName: 'Lefebvre Paul',
    patientId: '12348',
    examType: 'Radiographie Thorax',
    examDate: '2024-01-13',
    status: 'Signé',
    doctor: 'Dr. Dubois',
  },
  {
    id: '5',
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
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: 'patientName',
        header: ({ column }) => (
          <div className={styles.sortIcon} onClick={() => column.toggleSorting()}>
            Patient
            <ArrowUpDown size={14} />
          </div>
        ),
        cell: ({ row }) => (
          <div className={styles.patientCell}>
            <div className={styles.patientIcon}>
              <FileText size={16} />
            </div>
            <div className={styles.patientInfo}>
              <span className={styles.patientName}>{row.original.patientName}</span>
              <span className={styles.patientId}>ID: {row.original.patientId}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'examType',
        header: ({ column }) => (
          <div className={styles.sortIcon} onClick={() => column.toggleSorting()}>
            Type d'Examen
            <ArrowUpDown size={14} />
          </div>
        ),
      },
      {
        accessorKey: 'examDate',
        header: ({ column }) => (
          <div className={styles.sortIcon} onClick={() => column.toggleSorting()}>
            Date
            <ArrowUpDown size={14} />
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Statut',
        cell: ({ getValue }) => (
          <span className={styles.statusBadge}>{getValue() as string}</span>
        ),
      },
      {
        accessorKey: 'doctor',
        header: 'Médecin',
      },
    ],
    [styles]
  );

  const table = useReactTable({
    data: mockReports,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
        <table className={styles.table}>
          <thead className={styles.thead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.th}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={styles.tr}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={styles.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Flexbox>
  );
}
