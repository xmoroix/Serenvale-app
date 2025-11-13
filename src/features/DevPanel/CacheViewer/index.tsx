'use client';

import { Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Center } from 'react-layout-kit';

import DataTable from './DataTable';
import { CachePanelContextProvider } from './cacheProvider';
import { type NextCacheFileData, getCacheFiles } from './getCacheEntries';

const CacheViewer = () => {
  const [files, setFiles] = useState<NextCacheFileData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCacheFiles = async () => {
      try {
        const cacheFiles = await getCacheFiles();
        if (isMounted) {
          setFiles(cacheFiles);
        }
      } catch (error) {
        console.error('Error loading cache files:', error);
        if (isMounted) {
          setFiles([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCacheFiles();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Center height={'80%'}>
        <Spin size="large" />
      </Center>
    );
  }

  if (!files || files.length === 0) {
    return (
      <Center height={'80%'}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Center>
    );
  }

  return (
    <CachePanelContextProvider entries={files}>
      <DataTable />
    </CachePanelContextProvider>
  );
};

export default CacheViewer;
