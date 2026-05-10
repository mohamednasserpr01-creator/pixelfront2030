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
    videos: HomeworkLessonVideo[];
    pdfs: HomeworkLessonPDF[];
    references: HomeworkLessonReference[];
}