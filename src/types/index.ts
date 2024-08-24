import { ActivityPlatform, ActivityType } from 'xhyabunny-selfbot-v13';

export interface UserObj {
    alias: string;
    displayName: string;
    avatarUrl: string;
    bannerUrl: string;
    decoUrl: string;
    clanBadgeUrl: string;
    userName: string;
    id: string;
    createdAt: string;
    hasNitro: boolean | string;
    isBot: boolean;
    state: string;
    activities: ActivityObj[];
    status: string;
    relationship: string;
}

export type UserArray = UserObj[];

export interface ActivityObj {
    type: ActivityType | string;
    name: string;
    state: string;
    platform: ActivityPlatform | string;
}
