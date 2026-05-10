export type VideoPlatform = 'youtube' | 'vimeo' | 'bunny' | 'server';

export interface LessonVideo {
    id: string;
    title: string;
    url: string; 
    platform: VideoPlatform;
    showPreview: boolean; // 💡 زرار المعاينة اللي طلبته
}

export interface LessonPDF {
    id: string;
    title: string;
    file: File | null;
    previewUrl: string | null;
}

export interface LessonReference {
    id: string;
    title: string;
    url: string;
}

export interface LessonBuilderState {
    title: string;
    description: string;
    videos: LessonVideo[];
    pdfs: LessonPDF[];
    references: LessonReference[];
}