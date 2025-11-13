import { Icon } from '@lobehub/ui';
import { TabBar, type TabBarProps } from '@lobehub/ui/mobile';
import { createStyles } from 'antd-style';
import { ClipboardList, FolderClosed, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { rgba } from 'polished';
import { memo, useMemo } from 'react';

import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const useStyles = createStyles(({ css, token }) => ({
  active: css`
    svg {
      fill: ${rgba(token.colorPrimary, 0.25)};
    }
  `,
}));

interface Props {
  className?: string;
  tabBarKey?: SidebarTabKey;
}

export default memo<Props>(({ className, tabBarKey }) => {
  const { styles } = useStyles();
  const router = useRouter();
  const openSettings = () => {
    router.push('/settings?active=llm');
  };
  const { enableKnowledgeBase } = useServerConfigStore(featureFlagsSelectors);

  const items: TabBarProps['items'] = useMemo(
    () =>
      [
        {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={ClipboardList} />
          ),
          key: SidebarTabKey.Chat,
          onClick: () => {
            router.push('/worklist');
          },
          title: 'Worklist',
        },
        enableKnowledgeBase && {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={FolderClosed} />
          ),
          key: SidebarTabKey.Files,
          onClick: () => {
            router.push('/knowledge');
          },
          title: 'Knowledge',
        },
        {
          icon: (active: boolean) => (
            <Icon className={active ? styles.active : undefined} icon={User} />
          ),
          key: SidebarTabKey.Setting,
          onClick: openSettings,
          title: 'Settings',
        },
      ].filter(Boolean) as TabBarProps['items'],
    [],
  );

  return <TabBar activeKey={tabBarKey} className={className} items={items} safeArea />;
});
