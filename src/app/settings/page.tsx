'use client';

import { createStyles } from 'antd-style';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    height: 100vh;
    background: ${token.colorBgLayout};
    padding: ${token.paddingLG}px;
  `,
  title: css`
    font-size: 24px;
    font-weight: 600;
    color: ${token.colorText};
    margin-bottom: ${token.marginLG}px;
  `,
}));

export default function SettingsPage() {
  const { styles } = useStyles();

  return (
    <Flexbox className={styles.container}>
      <h1 className={styles.title}>⚙️ Paramètres</h1>
      <p>Settings page - Coming soon in Phase 3</p>
    </Flexbox>
  );
}
