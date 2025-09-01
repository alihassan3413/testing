export type Memory = {
    img?: string;           // /memories/xxx.jpg (optional)
    title?: string;
    text?: string;          // long paragraph ok!
}

export const MEMORIES: Memory[] = [
    {
        img: 'https://images.pexels.com/photos/7080037/pexels-photo-7080037.jpeg',
        title: 'Note: 8 Dec 2023',
        text: 'The way Amna is looking today😭🤌🏻♥️.The sense of style she has light green colour dress,skin coloured hijab and those cute khusa.How graceful and charming she looks😭🤌🏻♥️.That skin colour hijab looks too too much pretty on her♥️.She is perfect in her own ways.That cute , minimalistic aura she has 😭🤌🏻♥️.Whatever she wore she looks perfect😫♥️.'
    },
    //   {
    //     img: '/memories/amna-2.jpg',
    //     title: 'Midnight Walk',
    //     text: 'We walked with no map, followed the breeze, and promised to always keep a little adventure in our pockets.'
    //   },
    //   {
    //     // text-only block, no image:
    //     title: 'A Note to You',
    //     text: `Amna, thank you for being kind, curious, and wonderfully you.
    // I built this for you so whenever you open it, you remember you are deeply loved.`
    //   },
]
