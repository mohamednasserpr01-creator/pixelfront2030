export type VideoPlatform = 'youtube' | 'vimeo' | 'bunny' | 'server';

export interface HomeworkLessonVideo {
    id: string;
    title: string;
    url: string; 
    platform: VideoPlatform;
    showPreview: boolean; 
}

export interface HomeworkLessonPDF {
    id: string;
    title: string;
    url?: string; // 🚀 ده السطر اللي ضفناه عشان الإيرور بتاع رابط الملف يختفي
    file: File | null;
    previewUrl: string | null;
}

export interface HomeworkLessonReference {
    id: string;
    title: string;
    url: string;
}

export interface HomeworkLessonBuilderState {
    title: string;
    description: string;
    stage?: string; // 🚀 ضفنا المرحلة هنا عشان تتحفظ بدون أي مشاكل
    videos: HomeworkLessonVideo[];
    pdfs: HomeworkLessonPDF[];
    references: HomeworkLessonReference[];
}