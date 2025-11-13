'use client';

import { Form, Input, Tabs, Select, InputNumber, Switch, Upload, Button } from 'antd';
import { createStyles } from 'antd-style';
import { Settings as SettingsIcon, Database, Building2, UserCircle, Brain, Printer as PrinterIcon, Palette, Upload as UploadIcon } from 'lucide-react';
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
    display: flex;
    align-items: center;
    gap: ${token.marginSM}px;
  `,
  content: css`
    flex: 1;
    overflow: auto;
    padding: ${token.paddingLG}px;
  `,
  tabsContainer: css`
    background: ${token.colorBgContainer};
    border-radius: ${token.borderRadius}px;
    padding: ${token.paddingLG}px;

    .ant-tabs-nav {
      margin-bottom: ${token.marginLG}px;
    }
  `,
  formSection: css`
    max-width: 800px;
  `,
  sectionTitle: css`
    font-size: 16px;
    font-weight: 500;
    color: ${token.colorText};
    margin-bottom: ${token.marginMD}px;
  `,
}));

export default function SettingsPage() {
  const { styles } = useStyles();
  const [form] = Form.useForm();

  const pacsTab = (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Configuration PACS</h3>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Adresse IP du PACS"
          name="pacsIp"
          rules={[{ required: true, message: 'Adresse IP requise' }]}
        >
          <Input placeholder="192.168.1.100" />
        </Form.Item>

        <Form.Item
          label="Port"
          name="pacsPort"
          rules={[{ required: true, message: 'Port requis' }]}
        >
          <InputNumber min={1} max={65535} placeholder="4242" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="AE Title (Application Entity)"
          name="aeTitle"
          rules={[{ required: true, message: 'AE Title requis' }]}
        >
          <Input placeholder="SERENVALE" />
        </Form.Item>

        <Form.Item
          label="AE Title du PACS"
          name="pacsAeTitle"
        >
          <Input placeholder="PACS_SERVER" />
        </Form.Item>

        <Form.Item
          label="Requête par défaut"
          name="defaultQuery"
        >
          <Select placeholder="Sélectionner">
            <Select.Option value="today">Aujourd'hui</Select.Option>
            <Select.Option value="stat">STAT uniquement</Select.Option>
            <Select.Option value="all">Tous</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Authentification HL7"
          name="hl7Auth"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Button type="primary">Tester la connexion</Button>
      </Form>
    </div>
  );

  const clinicTab = (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Informations de la Clinique</h3>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nom de la Clinique"
          name="clinicName"
          rules={[{ required: true, message: 'Nom requis' }]}
        >
          <Input placeholder="Centre d'Imagerie Médicale" />
        </Form.Item>

        <Form.Item
          label="Adresse"
          name="clinicAddress"
        >
          <Input.TextArea rows={3} placeholder="123 Rue de la Santé, 75014 Paris" />
        </Form.Item>

        <Form.Item
          label="NIF / SIRET"
          name="clinicNif"
        >
          <Input placeholder="123 456 789 00012" />
        </Form.Item>

        <Form.Item
          label="Téléphone"
          name="clinicPhone"
        >
          <Input placeholder="+33 1 23 45 67 89" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="clinicEmail"
        >
          <Input type="email" placeholder="contact@clinique.fr" />
        </Form.Item>

        <Form.Item
          label="Logo de la Clinique"
          name="clinicLogo"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadIcon size={16} />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Button type="primary">Enregistrer</Button>
      </Form>
    </div>
  );

  const doctorTab = (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Informations du Médecin</h3>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nom complet"
          name="doctorName"
          rules={[{ required: true, message: 'Nom requis' }]}
        >
          <Input placeholder="Dr. Jean Martin" />
        </Form.Item>

        <Form.Item
          label="Spécialité"
          name="doctorSpecialty"
        >
          <Input placeholder="Radiologue" />
        </Form.Item>

        <Form.Item
          label="Numéro RPPS"
          name="doctorRpps"
        >
          <Input placeholder="12345678901" />
        </Form.Item>

        <Form.Item
          label="Signature (Image)"
          name="doctorSignature"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadIcon size={16} />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Tampon (Image)"
          name="doctorStamp"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadIcon size={16} />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Button type="primary">Enregistrer</Button>
      </Form>
    </div>
  );

  const aiTab = (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Configuration IA</h3>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Clé API OpenAI"
          name="openaiKey"
          rules={[{ required: true, message: 'Clé API requise' }]}
        >
          <Input.Password placeholder="sk-proj-..." />
        </Form.Item>

        <Form.Item
          label="Agent par défaut (IRM)"
          name="agentIrm"
        >
          <Select placeholder="Sélectionner un agent">
            <Select.Option value="irm_general">IRM Général</Select.Option>
            <Select.Option value="irm_cerebral">IRM Cérébral</Select.Option>
            <Select.Option value="irm_rachis">IRM Rachis</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Agent par défaut (TDM)"
          name="agentTdm"
        >
          <Select placeholder="Sélectionner un agent">
            <Select.Option value="tdm_general">TDM Général</Select.Option>
            <Select.Option value="tdm_thorax">TDM Thorax</Select.Option>
            <Select.Option value="tdm_abdomen">TDM Abdomen</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Température (créativité)"
          name="temperature"
        >
          <InputNumber
            min={0}
            max={1}
            step={0.1}
            defaultValue={0.3}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Tokens max (mémoire)"
          name="maxTokens"
        >
          <InputNumber
            min={1024}
            max={32768}
            step={1024}
            defaultValue={8192}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          label="Modèle de prompt personnalisé"
          name="promptTemplate"
        >
          <Input.TextArea
            rows={4}
            placeholder="Tu es un radiologue expert spécialisé en..."
          />
        </Form.Item>

        <Button type="primary">Enregistrer</Button>
      </Form>
    </div>
  );

  const printerTab = (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Configuration Imprimante</h3>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Nom de l'imprimante réseau"
          name="printerName"
        >
          <Input placeholder="HP_LaserJet_Pro" />
        </Form.Item>

        <Form.Item
          label="Format de papier par défaut"
          name="paperSize"
        >
          <Select placeholder="Sélectionner" defaultValue="a4">
            <Select.Option value="a4">A4 (210 x 297 mm)</Select.Option>
            <Select.Option value="letter">Letter (8.5 x 11 in)</Select.Option>
            <Select.Option value="legal">Legal (8.5 x 14 in)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Orientation par défaut"
          name="orientation"
        >
          <Select placeholder="Sélectionner" defaultValue="portrait">
            <Select.Option value="portrait">Portrait</Select.Option>
            <Select.Option value="landscape">Paysage</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Impression recto-verso"
          name="duplex"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Imprimer automatiquement après signature"
          name="autoPrint"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Button type="primary">Enregistrer</Button>
      </Form>
    </div>
  );

  const themeTab = (
    <div className={styles.formSection}>
      <h3 className={styles.sectionTitle}>Personnalisation du Thème</h3>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Mode d'affichage"
          name="themeMode"
        >
          <Select placeholder="Sélectionner" defaultValue="auto">
            <Select.Option value="light">Clair</Select.Option>
            <Select.Option value="dark">Sombre</Select.Option>
            <Select.Option value="auto">Automatique</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Couleur principale"
          name="primaryColor"
        >
          <Input type="color" defaultValue="#1677ff" style={{ width: 100, height: 40 }} />
        </Form.Item>

        <Form.Item
          label="Logo de l'application"
          name="appLogo"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={() => false}
          >
            <div>
              <UploadIcon size={16} />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Langue par défaut"
          name="defaultLanguage"
        >
          <Select placeholder="Sélectionner" defaultValue="fr">
            <Select.Option value="fr">Français</Select.Option>
            <Select.Option value="en">English</Select.Option>
          </Select>
        </Form.Item>

        <Button type="primary">Enregistrer</Button>
      </Form>
    </div>
  );

  const tabItems = [
    {
      key: 'pacs',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={16} />
          PACS
        </span>
      ),
      children: pacsTab,
    },
    {
      key: 'clinic',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Building2 size={16} />
          Clinique
        </span>
      ),
      children: clinicTab,
    },
    {
      key: 'doctor',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserCircle size={16} />
          Médecin
        </span>
      ),
      children: doctorTab,
    },
    {
      key: 'ai',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Brain size={16} />
          IA
        </span>
      ),
      children: aiTab,
    },
    {
      key: 'printer',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PrinterIcon size={16} />
          Imprimante
        </span>
      ),
      children: printerTab,
    },
    {
      key: 'theme',
      label: (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Palette size={16} />
          Thème
        </span>
      ),
      children: themeTab,
    },
  ];

  return (
    <Flexbox className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <SettingsIcon size={24} />
          Paramètres
        </h1>
      </div>

      <div className={styles.content}>
        <div className={styles.tabsContainer}>
          <Tabs
            defaultActiveKey="pacs"
            items={tabItems}
            size="large"
          />
        </div>
      </div>
    </Flexbox>
  );
}
