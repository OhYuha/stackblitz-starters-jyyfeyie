'use client';

import { use } from 'react';
import MapEditor from '@/components/editor/MapEditor';

export default function TeacherEditorPage({
  params,
}: {
  params: Promise<{ mapId: string }>;
}) {
  const resolvedParams = use(params);
  const mapId = resolvedParams.mapId;

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900">
      <MapEditor mapId={mapId} />
    </div>
  );
}
