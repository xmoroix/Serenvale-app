'use client';

/* eslint-disable @typescript-eslint/no-use-before-define */
import { EyeOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { DicomWorklistEntry, pacsService } from '@/services/pacs';
import { weasisService } from '@/services/weasis';
import { usePacsStore } from '@/store/pacs';
import { pacsSelectors } from '@/store/pacs/selectors';
import { useWorklistStore } from '@/store/worklist';

interface PACSResult {
  accessionNumber?: string;
  age: number;
  examDate: string;
  examTime?: string;
  examType: string; // Internal format
  examTypeDisplay: string; // Display format
  key: string;
  modality?: string;
  patientId: string;
  patientName: string;
  referringDoctor: string;
  studyInstanceUid?: string;
}

/**
 * Map DICOM modality to internal exam type
 */
const mapModalityToExamType = (
  modality: string | undefined,
  procedure: string | undefined,
): { examType: string; examTypeDisplay: string } => {
  const mod = modality?.toUpperCase() || '';
  const proc = procedure?.toLowerCase() || '';

  // MR (Magnetic Resonance)
  if (mod === 'MR') {
    if (proc.includes('brain') || proc.includes('cérébr') || proc.includes('cerebr')) {
      return { examType: 'irm-cerebrale', examTypeDisplay: 'IRM Cérébrale' };
    }
    return { examType: 'irm-autre', examTypeDisplay: 'IRM Autre' };
  }

  // CT (Computed Tomography)
  if (mod === 'CT') {
    if (proc.includes('chest') || proc.includes('thorax') || proc.includes('thor')) {
      return { examType: 'tdm-thorax', examTypeDisplay: 'TDM Thorax' };
    }
    return { examType: 'tdm-autre', examTypeDisplay: 'TDM Autre' };
  }

  // US (Ultrasound)
  if (mod === 'US') {
    if (proc.includes('abdomen') || proc.includes('abdomin')) {
      return { examType: 'echo-abdomen', examTypeDisplay: 'Échographie Abdomen' };
    }
    return { examType: 'echo-autre', examTypeDisplay: 'Échographie Autre' };
  }

  // CR/DR (Computed/Digital Radiography)
  if (mod === 'CR' || mod === 'DR' || mod === 'DX') {
    if (proc.includes('chest') || proc.includes('thorax') || proc.includes('thor')) {
      return { examType: 'xr-thorax', examTypeDisplay: 'Radiographie Thorax' };
    }
    return { examType: 'xr-autre', examTypeDisplay: 'Radiographie Autre' };
  }

  // Default
  return { examType: 'autre', examTypeDisplay: proc || modality || 'Examen' };
};

/**
 * Parse DICOM age format (e.g., "045Y" -> 45)
 */
const parseAge = (ageString: string | undefined): number => {
  if (!ageString) return 0;
  const match = ageString.match(/(\d+)/);
  return match ? Number.parseInt(match[1]) : 0;
};

/**
 * Format DICOM date (YYYYMMDD -> YYYY-MM-DD)
 */
const formatDate = (dicomDate: string | undefined): string => {
  if (!dicomDate || dicomDate.length !== 8) {
    return new Date().toISOString().split('T')[0];
  }
  const year = dicomDate.slice(0, 4);
  const month = dicomDate.slice(4, 6);
  const day = dicomDate.slice(6, 8);
  return `${year}-${month}-${day}`;
};

/**
 * Format DICOM time (HHMMSS -> HH:MM)
 */
const formatTime = (dicomTime: string | undefined): string | undefined => {
  if (!dicomTime || dicomTime.length < 4) return undefined;
  const hours = dicomTime.slice(0, 2);
  const minutes = dicomTime.slice(2, 4);
  return `${hours}:${minutes}`;
};

/**
 * Transform DICOM worklist entry to PACSResult
 */
const transformDicomEntry = (entry: DicomWorklistEntry): PACSResult => {
  const { examType, examTypeDisplay } = mapModalityToExamType(
    entry.modality,
    entry.requestedProcedure || entry.scheduledProcedure,
  );

  return {
    accessionNumber: entry.accessionNumber,
    age: parseAge(entry.patientAge),
    examDate: formatDate(entry.scheduledStartDate),
    examTime: formatTime(entry.scheduledStartTime),
    examType,
    examTypeDisplay,
    key: entry.accessionNumber || entry.patientId,
    modality: entry.modality,
    patientId: entry.patientId,
    patientName: entry.patientName.replace('^', ' '), // Convert DICOM name format
    referringDoctor: entry.referringPhysician || 'N/A',
    studyInstanceUid: entry.studyInstanceUid,
  };
};

const PACSResultsTable = () => {
  const router = useRouter();
  const selectPatient = useWorklistStore((s) => s.selectPatient);
  const pacsEnabled = usePacsStore(pacsSelectors.isEnabled);

  const [worklistData, setWorklistData] = useState<PACSResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Wrap handleRefresh in useCallback to prevent unnecessary re-renders
  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await pacsService.queryWorklist({
        // Query for today's scheduled procedures
        dateRange: {
          end: new Date().toISOString().split('T')[0].replaceAll('-', ''),
          start: new Date().toISOString().split('T')[0].replaceAll('-', ''),
        },
      });

      if (result.success) {
        const transformedData = result.entries.map(transformDicomEntry);
        setWorklistData(transformedData);
        message.success(`Loaded ${transformedData.length} worklist entries`);
      } else {
        setError(result.error);
        message.error(result.error || 'Failed to query PACS server');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load worklist';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - only uses stable state setters

  // Load worklist data on mount
  useEffect(() => {
    if (pacsEnabled) {
      handleRefresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pacsEnabled]); // handleRefresh is stable (useCallback with empty deps)

  const handleStartReport = (record: PACSResult) => {
    // Save patient data to store
    selectPatient({
      age: record.age,
      examDate: record.examDate,
      examType: record.examType,
      examTypeDisplay: record.examTypeDisplay,
      id: record.patientId,
      name: record.patientName,
      referringDoctor: record.referringDoctor,
    });

    // Navigate to report page
    router.push(`/report/${record.patientId}`);
  };

  const handleViewImages = async (record: PACSResult) => {
    if (!record.studyInstanceUid) {
      message.warning('Study Instance UID not available for this exam');
      return;
    }

    await weasisService.launchWeasis({
      accessionNumber: record.accessionNumber,
      patientId: record.patientId,
      patientName: record.patientName,
      studyInstanceUid: record.studyInstanceUid,
    });
  };

  const columns: ColumnsType<PACSResult> = [
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
      dataIndex: 'examDate',
      key: 'examDate',
      render: (date: string, record: PACSResult) =>
        record.examTime ? `${date} ${record.examTime}` : date,
      sorter: (a, b) => a.examDate.localeCompare(b.examDate),
      title: 'Scheduled Time',
    },
    {
      dataIndex: 'examTypeDisplay',
      key: 'examType',
      render: (typeDisplay: string, record: PACSResult) => {
        const colorMap: Record<string, string> = {
          'echo-abdomen': 'orange',
          'echo-autre': 'orange',
          'irm-autre': 'blue',
          'irm-cerebrale': 'blue',
          'tdm-autre': 'green',
          'tdm-thorax': 'green',
          'xr-autre': 'purple',
          'xr-thorax': 'purple',
        };
        return <Tag color={colorMap[record.examType] || 'default'}>{typeDisplay}</Tag>;
      },
      title: 'Exam Type',
    },
    {
      dataIndex: 'modality',
      key: 'modality',
      render: (mod: string | undefined) => (mod ? <Tag>{mod}</Tag> : null),
      title: 'Modality',
    },
    {
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            disabled={!record.studyInstanceUid}
            icon={<EyeOutlined />}
            onClick={() => handleViewImages(record)}
            title={record.studyInstanceUid ? 'View images in Weasis' : 'Study UID not available'}
          >
            View Images
          </Button>
          <Button
            icon={<PlayCircleOutlined />}
            onClick={() => handleStartReport(record)}
            type="primary"
          >
            Start Report
          </Button>
        </Space>
      ),
      title: 'Actions',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Refresh Button */}
      <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
        <Button
          disabled={!pacsEnabled}
          icon={<ReloadOutlined />}
          loading={isLoading}
          onClick={handleRefresh}
        >
          {isLoading ? 'Querying PACS...' : 'Refresh Worklist'}
        </Button>

        {!pacsEnabled && (
          <span style={{ color: '#999', fontSize: 14 }}>
            PACS integration disabled. Enable in Settings → PACS.
          </span>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          closable
          description={error}
          message="PACS Query Error"
          onClose={() => setError(undefined)}
          showIcon
          type="error"
        />
      )}

      {/* Worklist Table */}
      <Table
        columns={columns}
        dataSource={worklistData}
        loading={isLoading}
        locale={{
          emptyText: pacsEnabled
            ? 'No pending exams. Click "Refresh Worklist" to query PACS.'
            : 'PACS integration is disabled. Enable in Settings → PACS.',
        }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PACSResultsTable;
