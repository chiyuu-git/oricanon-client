import { ProjectName } from '@chiyu-bit/canon.root';

export const ProjectColorMap = {
    [ProjectName.ll]: '#ee0088',
    [ProjectName.lls]: '#4fc4fe',
    [ProjectName.llss]: '#a6469d',
    [ProjectName.lln]: '#f39800',
} as const;

export const characterRomeMap = {
    // muse
    '高坂穂乃果': 'honoka',
    '絢瀬絵里': 'eri',
    '南ことり': 'kotori',
    '園田海未': 'umi',
    '星空凛': 'rin',
    '西木野真姫': 'maki',
    '東條希': 'nozomi',
    '小泉花陽': 'hanayo',
    '矢澤にこ': 'nico',
    // aqours
    '高海千歌': 'chika',
    '桜内梨子': 'rico',
    '松浦果南': 'kanan',
    '黒澤ダイヤ': 'dia',
    '渡辺曜': 'you',
    '津島善子': 'yoshiko',
    '国木田花丸': 'hanamaru',
    '小原鞠莉': 'mari',
    '黒澤ルビィ': 'ruby',
    '鹿角聖良': 'seira',
    '鹿角理亞': 'leah',
    // hello
    '澁谷かのん': 'kanon',
    '唐可可': 'keke',
    '嵐千砂都': 'chisato',
    '平安名すみれ': 'sumire',
    '葉月恋': 'ren',
    // nijigasaki
    '上原歩夢': 'ayumu',
    '中須かすみ': 'kasumi',
    '桜坂しずく': 'shizuku',
    '朝香果林': 'karin',
    '宮下愛': 'ai',
    '近江彼方': 'kanata',
    '優木せつ菜': 'setsuna',
    'エマ・ヴェルデ': 'ema',
    '天王寺璃奈': 'rina',
    '高咲侑': 'me',
    '三船栞子': 'shioriko',
    'ミア・テイラー': 'mia',
    '鐘嵐珠': 'lanzhu',
};

export type KeyofCharacterRomeMap = keyof typeof characterRomeMap

// TODO: character 需要新增字段 代表色，企划没有明确的代表色，就不新增了
export const romaColorMap = {
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

export type KeyofRomaColorMap = keyof typeof romaColorMap
