import revision from 'child_process';

export const getCommitHash = (): string => revision.execSync('git rev-parse --short HEAD').toString().trim();
