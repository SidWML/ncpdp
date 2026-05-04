import React from 'react';
import { activityFeed } from '@/lib/mockData';
import { IconBell, IconCpu, IconZap, IconReport } from '@/components/ui/Icons';

const typeConfig = {
  alert:  { Icon: IconBell,   bg: '#FEF2F2', color: '#DC2626' },
  agent:  { Icon: IconCpu,    bg: '#E8F3F9', color: '#005C8D' },
  api:    { Icon: IconZap,    bg: '#E8F3F9', color: '#1474A4' },
  report: { Icon: IconReport, bg: '#ECFDF5', color: '#449055' },
};

const severityDot: Record<string, string> = {
  critical: '#DC2626',
  warning:  '#D97706',
  info:     '#1474A4',
  success:  '#449055',
};

export function ActivityFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {activityFeed.map((item, i) => {
        const tcfg = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.alert;
        const dot = severityDot[item.severity];
        const isLast = i === activityFeed.length - 1;

        return (
          <div key={item.id} style={{ display: 'flex', gap: 10, paddingBottom: isLast ? 0 : 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: tcfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <tcfg.Icon size={13} color={tcfg.color}/>
              </div>
              {!isLast && <div style={{ width: 1, flex: 1, background: 'var(--border-light)', marginTop: 4 }}/>}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1, minWidth: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block', marginTop: 6, flexShrink: 0 }}/>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, paddingTop: 2 }}>{item.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
