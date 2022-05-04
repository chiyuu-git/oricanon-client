import { ProjectName } from '@common/root';
import { H4_FONT_SIZE } from './echarts-toolbox';

export const PROJECT_AVERAGE_STR = '企划平均';

export const ProjectColorMap = {
    [ProjectName.ll]: '#ee0088',
    [ProjectName.lls]: '#4fc4fe',
    [ProjectName.lln]: '#f39800',
    [ProjectName.llss]: '#a6469d',
} as const;

export const ProjectShorthandMap = {
    [ProjectName.ll]: 'LL',
    [ProjectName.lls]: 'LLS',
    [ProjectName.lln]: 'LLN',
    [ProjectName.llss]: 'LLSS',
} as const;

export const romaColorMap = {
    // ll
    honoka: '#ffae00',
    eli: '#00bbff',
    kotori: '#a8a8a8',
    umi: '#6d56ff',
    rin: '#fee155',
    maki: '#ff6239',
    nozomi: '#e44fff',
    hanayo: '#44cd71',
    nico: '#ff62dd',
    // lls
    chika: '#ff791b',
    anju: '#ff791b',
    riko: '#ff7777',
    rikako: '#ff7777',
    kanan: '#00d29e',
    suwawa: '#00d29e',
    dia: '#f43232',
    arisa: '#f43232',
    you: '#2aa4db',
    shuku: '#2aa4db',
    yoshiko: '#aeaeae',
    aikyan: '#aeaeae',
    hanamaru: '#cfba0f',
    king: '#cfba0f',
    mari: '#a530e0',
    aina: '#a530e0',
    ruby: '#ee55b7',
    aiai: '#ee55b7',
    leah: '#bbbbbb',
    sarah: '#00ccff',
    // llss
    kanon: '#ff7f27',
    sayurin: '#ff7f27',
    keke: '#a0fff9',
    liyuu: '#a0fff9',
    chisato: '#ff6e90',
    nako: '#ff6e90',
    sumire: '#74f466',
    payton: '#74f466',
    ren: '#0000a0',
    nagisa: '#0000a0',
    kinako: '#FFF442',
    mei: '#FF3535',
    shiki: '#B2FFDD',
    natsumiC: '#FF51C4',
    // lln
    ayumu: '#ed7d95',
    aguri: '#ed7d95',
    kasumi: '#e7d600',
    mayu: '#e7d600',
    shizuku: '#01b7ed',
    kaorin: '#01b7ed',
    karin: '#485ec6',
    miyu: '#485ec6',
    ai: '#ff5800',
    natsumiS: '#ff5800',
    kanada: '#a664a0',
    akarin: '#a664a0',
    setsuna: '#d81c2f',
    tomori: '#d81c2f',
    ema: '#84c36e',
    sashide: '#84c36e',
    rina: '#9ca5b9',
    chiemi: '#9ca5b9',
    shioriko: '#37b484',
    moeka: '#37b484',
    yuu: '#1d1d1d',
    hinaki: '#1d1d1d',
    mia: '#a9a898',
    shu: '#a9a898',
    lanzhu: '#f69992',
    akina: '#f69992',
};

export type KeyofRomaColorMap = keyof typeof romaColorMap

// 准备 rich 对象，以角色罗马音为 key，绑定应援色
export const charaRichMap: Record<string, unknown> = {};
for (const [romaName, supportColor] of Object.entries(romaColorMap)) {
    charaRichMap[romaName] = {
        color: supportColor,
        fontSize: H4_FONT_SIZE,
        fontWeight: 'bold',
    };
}

// 准备 rich 对象，以企划名为 key，绑定颜色
export const projectRichMap: Record<string, unknown> = {};
for (const [projectName, color] of Object.entries(ProjectColorMap)) {
    projectRichMap[projectName] = {
        color,
        fontSize: H4_FONT_SIZE,
        fontWeight: 'bold',
    };
}
