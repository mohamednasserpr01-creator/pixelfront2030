export const dashboardData = {
    overview: {
        activeCourses: 3,
        completionRate: 78,
        lateHomeworks: 1,
        nextSession: { doctor: "د. أحمد سمير", date: "الأربعاء 18 مارس، الساعة 08:00 مساءً" },
        resume: { title: "الفيزياء (الباب الأول) - محاضرة 4" }
    },
    courses: [
        { id: 1, title: "الفيزياء - الباب الأول", teacher: "أ. محمد ناصر", progress: 80, color: "var(--success)" },
        { id: 2, title: "الكيمياء العضوية - التأسيس", teacher: "أ. محمود سعيد", progress: 45, color: "var(--warning)" }
    ],
    exams: [
        { id: 1, type: "امتحان حصة", title: "امتحان قانون أوم", subject: "الفيزياء", score: "18 / 20", date: "15 مارس", status: "ممتاز", statusClass: "success", typeClass: "purple" },
        { id: 2, type: "واجب", title: "واجب المحاضرة الثالثة", subject: "الكيمياء", score: "6 / 10", date: "12 مارس", status: "يحتاج مراجعة", statusClass: "warning", typeClass: "warning" }
    ],
    financials: [
        { id: 1, code: "8492-XXXX-XXXX-1934", source: "أ. محمد ناصر (الفيزياء)", amount: "+ 500 ج.م", date: "10 مارس 2026" }
    ],
    orders: [
        { pin: "#PXL-9824-XV", items: "مذكرة العضوية + كتاب الفيزياء", date: "16 مارس 2026", status: "جاري التوصيل", statusClass: "warning" },
        { pin: "#PXL-1120-MQ", items: "ملخص قوانين الفيزياء", date: "01 مارس 2026", status: "تم التسليم", statusClass: "success" }
    ],
    analytics: {
        attendance: 92,
        msg: "أنت ملتزم جداً بمواعيد المحاضرات وحل الواجبات.",
        skills: [
            { name: "الفيزياء (نقطة قوة)", score: 85, color: "var(--success)" },
            { name: "الكيمياء (يحتاج تحسين)", score: 55, color: "var(--danger)" }
        ]
    },
    activity: [
        { id: 1, time: "17 Mar, 02:15 PM", action: "دخول المنصة", class: "success", details: "تسجيل الدخول بنجاح", device: "iPhone 13" },
        { id: 2, time: "16 Mar, 11:00 AM", action: "شراء متجر", class: "warning", details: "طلب مذكرات برقم تتبع #PXL-9824-XV", device: "Windows PC" }
    ],
    devices: [
        { id: 1, icon: 'mobile', name: "iPhone 13 (الجهاز الحالي)", location: "الإسكندرية, مصر", activity: "نشط الآن", isCurrent: true },
        { id: 2, icon: 'desktop', name: "Windows PC - Chrome", location: "القاهرة, مصر", activity: "منذ يومين", isCurrent: false }
    ]
};