export type Region = 'us' | 'eu' | 'kr' | 'tw' | 'cn';

export const getBlizzardApiHost = (region: Region): string => {
  if (region === 'cn') {
    return 'gateway.battlenet.com.cn';
  }
  return `${region}.api.blizzard.com`;
};

export const getNamespace = (region: Region, type: 'static' | 'dynamic' | 'profile'): string => {
  return `${type}-${region}`;
};

export const getLeaderboardEndpoint = (region: Region, bracket: string, gameVersion: string): string => {
  const host = getBlizzardApiHost(region);
  const namespace = getNamespace(region, 'dynamic');
  return `https://${host}/data/wow/pvp-season/1/pvp-leaderboard/${bracket}?namespace=${namespace}&locale=en_US&game_version=${gameVersion}`;
};

export const getCharacterEndpoint = (region: Region, realm: string, character: string): string => {
  const host = getBlizzardApiHost(region);
  const namespace = getNamespace(region, 'profile');
  return `https://${host}/profile/wow/character/${realm}/${character}?namespace=${namespace}&locale=en_US`;
}; 