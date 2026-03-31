import React from 'react';
import { activityFeed } from '@/lib/mockData';
import { IconBell, IconCpu, IconZap, IconReport, IconCheck } from '@/components/ui/Icons';

const typeConfig = {
  alert:  { Icon: IconBell,   bg: '#FEF2F2', color: '#DC2626' },
  agent:  { Icon: IconCpu,    bg: '#F5F3FF', color: '#7C3AED' },
  api:    { Icon: IconZap,    bg: '#EFF6FF', color: '#2563EB' },
  report: { Icon: IconReport, bg: '#ECFDF5', color: '#059669' },
};

const severityDot: Record<string, string> = {
  critical: '#EF4444',
  warning:  '#F59E0B',
  info:     '#3B82F6',
  success:  '#10B981',
};

export function ActivityFeed() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {activityFeed.map((item, i) => {
        const tcfg = typeConfig[item.type as keyof typeof typeConfig] || typeConfig.alert;
        const dot = severityDot[item.severity];
        const isLast = i === activityFeed.length - 1;

        return (
          <div key={item.id} style={{ display: 'flex', gap: 10, paddingBottom: isLast ? 0 : 12 }}>
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: tcfg.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <tcfg.Icon size={13} color={tcfg.color}/>
              </div>
              {!isLast && <div style={{ width: 1, flex: 1, background: 'var(--border-light)', marginTop: 4 }}/>}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0, paddingBottom: isLast ? 0 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, flex: 1, minWidth: 0 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, display: 'inline-block', marginTop: 5, flexShrink: 0 }}/>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.text}</span>
                </div>
                <span style={{ fontSize: 10.5, color: 'var(--text-muted)', flexShrink: 0, paddingTop: 2 }}>{item.time}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
