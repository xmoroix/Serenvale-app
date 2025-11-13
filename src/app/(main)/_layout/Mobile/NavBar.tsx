'use client';

import { Icon } from '@lobehub/ui';
import { TabBar, type TabBarProps } from '@lobehub/ui/mobile';
import { createStyles } from 'antd-style';
import { ClipboardList, FolderClosed, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { rgba } from 'polished';
import { memo, useMemo } from 'react';

import { MOBILE_TABBAR_HEIGHT } from '@/const/layoutTokens';
import { useActiveTabKey } from '@/hooks/useActiveTabKey';
import { SidebarTabKey } from '@/store/global/initialState';
import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';

const useStyles = createStyles(({ css, token }) => ({
  active: css`
    svg {
      fill: ${rgba(token.colorPrimary, 0.33)};
    }
  `,
  container: css`
    position: fixed;
    z-index: 100;
    inset-block-end: 0;
    inset-inline: 0 0;
  `,
}));

const NavBar = memo(() => {
  const { styles } = useStyles();
  const activeKey = useActiveTabKey();
  const router = useRouter();

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
          key: SidebarTabKey.Me,
          onClick: () => {
            router.push('/me');
          },
          title: 'Profile',
        },
      ].filter(Boolean) as TabBarProps['items'],
    [],
  );

  return (
    <TabBar
      activeKey={activeKey}
      className={styles.container}
      height={MOBILE_TABBAR_HEIGHT}
      items={items}
    />
  );
});

NavBar.displayName = 'NavBar';

export default NavBar;
