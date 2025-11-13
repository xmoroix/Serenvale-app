import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import { ClipboardList, FolderClosed, FileText } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const ICON_SIZE: ActionIconProps['size'] = {
  blockSize: 40,
  size: 24,
  strokeWidth: 2,
};

export interface TopActionProps {
  isPinned?: boolean | null;
  tab?: SidebarTabKey;
}

const TopActions = memo<TopActionProps>(({ tab, isPinned }) => {
  const { enableKnowledgeBase } = useServerConfigStore(featureFlagsSelectors);

  const isWorklistActive = tab === SidebarTabKey.Chat && !isPinned; // Reuse Chat tab key for worklist
  const isFilesActive = tab === SidebarTabKey.Files;

  return (
    <Flexbox gap={8}>
      <Link aria-label="Worklist" href={'/worklist'}>
        <ActionIcon
          active={isWorklistActive}
          icon={ClipboardList}
          size={ICON_SIZE}
          title="Worklist"
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      {enableKnowledgeBase && (
        <Link aria-label="Knowledge Base" href={'/knowledge'}>
          <ActionIcon
            active={isFilesActive}
            icon={FolderClosed}
            size={ICON_SIZE}
            title="Knowledge Base"
            tooltipProps={{ placement: 'right' }}
          />
        </Link>
      )}
    </Flexbox>
  );
});

export default TopActions;
