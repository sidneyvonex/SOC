import type { FieldReport } from '../types';
import { Priority, ReportStatus } from '../types';

/**
 * Initial seed data for the SOC Dashboard
 * This data would typically come from a secure backend API
 */

export const initialReports: FieldReport[] = [
  {
    id: '1',
    agent: 'FALCON',
    location: 'Mombasa',
    timestamp: '0730H',
    priority: Priority.HIGH,
    status: ReportStatus.NEW,
    summary: 'Unusual cargo movement at port berth 7. Three unmarked containers offloaded outside normal schedule. Dock workers cleared the area before offload.',
    createdAt: new Date('2026-04-25T07:30:00'),
    updatedAt: new Date('2026-04-25T07:30:00'),
    submittedBy: 'FALCON'
  },
  {
    id: '2',
    agent: 'EAGLE',
    location: 'Nairobi',
    timestamp: '0915H',
    priority: Priority.MEDIUM,
    status: ReportStatus.REVIEWED,
    summary: 'Target BRAVO observed meeting unknown contact at Westgate area. Duration approx 40 minutes. Photos obtained.',
    createdAt: new Date('2026-04-25T09:15:00'),
    updatedAt: new Date('2026-04-25T09:15:00'),
    submittedBy: 'EAGLE'
  },
  {
    id: '3',
    agent: 'VIPER',
    location: 'Kisumu',
    timestamp: '1200H',
    priority: Priority.LOW,
    status: ReportStatus.NEW,
    summary: 'Routine surveillance of lakeside crossing points. No unusual activity. Local police presence normal.',
    createdAt: new Date('2026-04-25T12:00:00'),
    updatedAt: new Date('2026-04-25T12:00:00'),
    submittedBy: 'VIPER'
  },
  {
    id: '4',
    agent: 'HAWK',
    location: 'Malindi',
    timestamp: '1430H',
    priority: Priority.CRITICAL,
    status: ReportStatus.NEW,
    summary: 'Intercepted communication referencing shipment arriving within 48 hours. Source reliability rated B2. Coordinates pending verification.',
    createdAt: new Date('2026-04-25T14:30:00'),
    updatedAt: new Date('2026-04-25T14:30:00'),
    submittedBy: 'HAWK'
  },
  {
    id: '5',
    agent: 'SHADOW',
    location: 'Nairobi',
    timestamp: '1600H',
    priority: Priority.HIGH,
    status: ReportStatus.ACTIONED,
    summary: 'Safe house on Ngong Road confirmed compromised. Assets relocated. Forensic sweep requested.',
    createdAt: new Date('2026-04-25T16:00:00'),
    updatedAt: new Date('2026-04-25T16:00:00'),
    submittedBy: 'SHADOW',
    lastModifiedBy: 'admin'
  }
];
