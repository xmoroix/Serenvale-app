'use client';

import { useServerConfigStore } from '@/store/serverConfig';

import FeatureFlagForm from './Form';

const FeatureFlagViewer = () => {
  const serverFeatureFlags = useServerConfigStore((s) => s.featureFlags);

  return <FeatureFlagForm flags={serverFeatureFlags} />;
};

export default FeatureFlagViewer;
