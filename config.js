import { PresenceUpdateStatus, ActivityType } from 'discord.js';

const Configuration = {
  developerIds: [
    '1043709478031343647',
    '783661052738011176',
    '967657941937291265',
  ],
  botPresence: {
    status: PresenceUpdateStatus.DoNotDisturb,
    activity: '/help',
    activityType: ActivityType.Watching,
  },
  guildId: '1029777893112418314', // Will be removed when it is public.
};

export default Configuration;
