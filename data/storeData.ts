const STAGES = { 'sec1':'الصف الأول الثانوي', 'sec2':'الصف الثاني الثانوي', 'sec3':'الصف الثالث الثانوي', 'all':'جميع المراحل' };

const generateProducts = () => {
    const products = [];
    for(let i = 1; i <= 60; i++) {
        let isBook = Math.random() > 0.3;
        let stock = i % 7 === 0 ? 0 : Math.floor(Math.random() * 50) + 1;
        let stageKeys = Object.keys(STAGES);
        let stageKey = stageKeys[Math.floor(Math.random() * 3)]; // excluding 'all'
        
        products.push({
            id: i,
            title: isBook ? `كتاب المراجعة النهائية - إصدار ${i}` : `أدوات مدرسية - صنف ${i}`,
            desc: `هذا النص هو وصف تفصيلي للمنتج رقم ${i}. يحتوي هذا الكتاب على أهم الأسئلة المتوقعة وتدريبات شاملة بنظام التقييم الجديد.`,
            price: Math.floor(Math.random() * 200) + 50,
            stock: stock,
            type: isBook ? 'books' : 'others',
            stageKey: stageKey,
            stageName: STAGES[stageKey as keyof typeof STAGES],
            publishDate: `1${Math.floor(Math.random()*9)}/02/2026`,
            image: `https://picsum.photos/600/800?random=${i}`
        });
    }
    return products;
};

export const productsDB = generateProducts();