'use client';

import { Icon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Activity, FileText, Microscope, Settings, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { Center, Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: ${token.paddingLG}px;
  `,
  hero: css`
    max-width: 1200px;
    width: 100%;
  `,
  title: css`
    font-size: 64px;
    font-weight: 800;
    margin-bottom: ${token.marginMD}px;
    color: white;
    text-align: center;
  `,
  subtitle: css`
    font-size: 24px;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    margin-bottom: 48px;
  `,
  featureGrid: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
  `,
  featureCard: css`
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadiusLG}px;
    padding: 24px;
    border: 1px solid ${token.colorBorder};
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
      border-color: ${token.colorPrimary};
    }
  `,
  featureIcon: css`
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: ${token.colorPrimaryBg};
    color: ${token.colorPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 28px;
  `,
  featureTitle: css`
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${token.colorText};
  `,
  featureDesc: css`
    font-size: 14px;
    color: ${token.colorTextSecondary};
    line-height: 1.6;
  `,
  ctaButtons: css`
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  `,
  primaryButton: css`
    background: ${token.colorPrimary};
    color: white;
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `,
  secondaryButton: css`
    background: white;
    color: ${token.colorPrimary};
    padding: 12px 32px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    border: 2px solid white;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-2px);
    }
  `,
}));

const features = [
  {
    icon: Activity,
    title: 'Liste de Travail PACS',
    description: 'Intégration DICOM complète avec gestion de la liste de travail PACS',
    href: '/worklist',
  },
  {
    icon: Microscope,
    title: 'Génération de Rapports AI',
    description: 'Rapports radiologiques générés par GPT-4 avec terminologie médicale',
    href: '/reports',
  },
  {
    icon: FileText,
    title: 'Recherche Sémantique',
    description: 'Recherche RadLex avec embeddings vectoriels pour une terminologie précise',
    href: '/radlex',
  },
  {
    icon: Stethoscope,
    title: 'Dictée Vocale',
    description: 'Transcription Whisper STT pour une dictée rapide et précise',
    href: '/dictation',
  },
  {
    icon: Settings,
    title: 'Paramètres',
    description: 'Configuration PACS, AI, imprimante et préférences docteur',
    href: '/settings',
  },
];

export default function Home() {
  const { styles } = useStyles();

  return (
    <Center className={styles.container}>
      <Flexbox className={styles.hero} gap={24}>
        <h1 className={styles.title}>🤯 Serenvale</h1>
        <p className={styles.subtitle}>
          Système de Rapport Radiologique Alimenté par l'IA
        </p>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Icon icon={feature.icon} size={{ fontSize: 28 }} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className={styles.ctaButtons}>
          <Link href="/worklist">
            <button className={styles.primaryButton}>
              Accéder à la Liste de Travail
            </button>
          </Link>
          <Link href="/settings">
            <button className={styles.secondaryButton}>
              Paramètres
            </button>
          </Link>
        </div>
      </Flexbox>
    </Center>
  );
}
