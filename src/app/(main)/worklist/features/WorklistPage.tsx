'use client';

import { Card, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Flexbox } from 'react-layout-kit';

import PACSQueryForm from './PACSQueryForm';
import PACSResultsTable from './PACSResultsTable';
import FinishedReportsTable from './FinishedReportsTable';

const WorklistPage = () => {
  const tabItems: TabsProps['items'] = [
    {
      key: 'pacs-worklist',
      label: 'PACS Worklist',
      children: (
        <Flexbox gap={24}>
          {/* PACS Query Section */}
          <Card title="PACS Query" bordered={false}>
            <PACSQueryForm />
          </Card>

          {/* PACS Results Section */}
          <Card title="PACS Results" bordered={false}>
            <PACSResultsTable />
          </Card>
        </Flexbox>
      ),
    },
    {
      key: 'finished-reports',
      label: 'Finished Reports',
      children: (
        <Card title="Finished Reports" bordered={false}>
          <FinishedReportsTable />
        </Card>
      ),
    },
  ];

  return (
    <Flexbox
      gap={24}
      padding={24}
      style={{ height: '100%', overflow: 'auto' }}
    >
      {/* Page Header */}
      <Flexbox gap={8}>
        <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>
          Serenvale Worklist
        </h1>
        <p style={{ color: 'rgba(0,0,0,0.45)', margin: 0 }}>
          Query PACS for patient exams and manage reports
        </p>
      </Flexbox>

      {/* Tabbed Interface */}
      <Tabs defaultActiveKey="pacs-worklist" items={tabItems} size="large" />
    </Flexbox>
  );
};

export default WorklistPage;
