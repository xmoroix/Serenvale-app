'use client';

import { CheckCircleOutlined, EditOutlined, EyeOutlined, FilePdfOutlined } from '@ant-design/icons';
import { RadiologyReport } from '@lobechat/database';
import { Button, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { radiologyService } from '@/services/radiology';
import { useWorklistStore } from '@/store/worklist';

interface FinishedReportRow {
  completedAt: string;
  examType: string;
  examTypeDisplay: string;
  key: string;
  patientAge: string;
  patientId: string;
  patientName: string;
  referringDoctor: string;
  reportId: string;
}

const FinishedReportsTable = () => {
  const router = useRouter();
  const selectPatient = useWorklistStore((s) => s.selectPatient);

  const [reports, setReports] = useState<RadiologyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load finished reports from database
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted

    const loadReports = async () => {
      try {
        const completedReports = await radiologyService.getReportsByStatus('completed');
        const signedReports = await radiologyService.getReportsByStatus('signed');

        // Only update state if component is still mounted
        if (isMounted) {
          setReports([...completedReports, ...signedReports]);
        }
      } catch (error) {
        // Only log error if component is still mounted
        if (isMounted) {
          console.error('Error loading reports:', error);
        }
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadReports();

    // Cleanup function - runs when component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Transform database data to table format
  const tableData: FinishedReportRow[] = reports.map((report) => ({
    completedAt: report.completedAt
      ? new Date(report.completedAt).toLocaleDateString('fr-FR')
      : new Date(report.updatedAt).toLocaleDateString('fr-FR'),
    examType: report.examType,
    examTypeDisplay: report.examTypeDisplay,
    key: report.id,
    patientAge: report.patientAge || '',
    patientId: report.patientId,
    patientName: report.patientName,
    referringDoctor: report.referringDoctor || '',
    reportId: report.id,
  }));

  const handleEditReport = (record: FinishedReportRow) => {
    // Load patient data into the store for the report page
    selectPatient({
      age: Number.parseInt(record.patientAge) || 0,
      examDate: record.completedAt,
      examType: record.examType,
      examTypeDisplay: record.examTypeDisplay,
      id: record.patientId,
      name: record.patientName,
      referringDoctor: record.referringDoctor,
    });

    // Navigate to report page for editing
    router.push(`/report/${record.patientId}`);
  };

  const handleViewReport = (record: FinishedReportRow) => {
    router.push(`/report/${record.patientId}`);
  };

  const handleExportPDF = (record: FinishedReportRow) => {
    console.log('Export PDF for:', record.patientId);
    // TODO: Implement PDF export logic from finished report
  };

  const columns: ColumnsType<FinishedReportRow> = [
    {
      key: 'status',
      render: () => <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />,
      title: '',
      width: 50,
    },
    {
      dataIndex: 'patientName',
      key: 'patientName',
      sorter: (a, b) => a.patientName.localeCompare(b.patientName),
      title: 'Patient Name',
    },
    {
      dataIndex: 'patientId',
      key: 'patientId',
      title: 'Patient ID',
    },
    {
      dataIndex: 'completedAt',
      defaultSortOrder: 'descend',
      key: 'completedAt',
      sorter: (a, b) => a.completedAt.localeCompare(b.completedAt),
      title: 'Report Date',
    },
    {
      dataIndex: 'examTypeDisplay',
      key: 'examType',
      render: (typeDisplay: string, record: FinishedReportRow) => {
        const colorMap: Record<string, string> = {
          'echo-abdomen': 'orange',
          'irm-cerebrale': 'blue',
          'tdm-thorax': 'green',
          'xr-thorax': 'purple',
        };
        return <Tag color={colorMap[record.examType] || 'default'}>{typeDisplay}</Tag>;
      },
      title: 'Exam Type',
    },
    {
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditReport(record)}>
            Edit
          </Button>
          <Button icon={<EyeOutlined />} onClick={() => handleViewReport(record)}>
            View
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => handleExportPDF(record)}>
            PDF
          </Button>
        </Space>
      ),
      title: 'Actions',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      loading={isLoading}
      locale={{
        emptyText: 'No finished reports yet.',
      }}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default FinishedReportsTable;
