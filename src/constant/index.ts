import { ProjectName } from '@chiyu-bit/canon.root';

export { ProjectName } from '@chiyu-bit/canon.root';

export const ProjectColorMap = {
    [ProjectName.ll]: '#ee0088',
    [ProjectName.lls]: '#4fc4fe',
    [ProjectName.llss]: '#a6469d',
    [ProjectName.lln]: '#f39800',
} as const;
// TODO: character 需要新增字段 代表色，企划没有明确的代表色，就不新增了
// 这样新增角色的时候就只需要处理 memberList 就好了
export const characterColorMap = {
    // ll
    honoka: '#ffae00',
    eri: '#00bbff',
    kotori: '#a8a8a8',
    umi: '#6d56ff',
    rin: '#fee155',
    maki: '#ff6239',
    nozomi: '#e44fff',
    hanayo: '#44cd71',
    nico: '#ff62dd',
    // lls
    chika: '#ff791b',
    rico: '#ff7777',
    kanan: '#00d29e',
    dia: '#f43232',
    you: '#2aa4db',
    yoshiko: '#aeaeae',
    hanamaru: '#cfba0f',
    mari: '#a530e0',
    ruby: '#ee55b7',
    leah: '#bbbbbb',
    seira: '#00ccff',
    // llss
    kanon: '#ff7f27',
    keke: '#a0fff9',
    chisato: '#ff6e90',
    sumire: '#74f466',
    ren: '#0000a0',
    // lln
    ayumu: '#ed7d95',
    kasumi: '#e7d600',
    shizuku: '#01b7ed',
    karin: '#485ec6',
    ai: '#ff5800',
    kanata: '#a664a0',
    setsuna: '#d81c2f',
    ema: '#84c36e',
    rina: '#9ca5b9',
    me: '#1d1d1d',
    shioriko: '#37b484',
    lanzhu: '#f69992',
    mia: '#a9a898',
};

export type CharacterColorRomaName = keyof typeof characterColorMap
