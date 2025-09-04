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
    {
        img: 'http://images.unsplash.com/photo-1584238832299-f37743d0bde8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: '9 Dec 2023',
        text: 'She uploaded the stories of herself from androon Lahore and how damn pretty she looks🌻🌷 matches the whole aesthetic vintage vibe of Androon Lahore🤌🏻💜.That simple purple and white colour dress with purple hijab and those black churiyan and that cute little butterfly shaped ring and those yellow and red coloured gajrey 😭😭🌻♥️ like everything just looks perfect on her😭🤌🏻💜.'
    },
    //   {
    //     // text-only block, no image:
    //     title: '16 Dec 2023',
    //     text: `Amna, thank you for being kind, curious, and wonderfully you.
    // I built this for you so whenever you open it, you remember you are deeply loved.`
    //   },
]
