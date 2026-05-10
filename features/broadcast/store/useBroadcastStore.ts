// FILE: features/broadcast/store/useBroadcastStore.ts
import { create } from 'zustand';
import { CampaignState, AudienceType, MsgType, SmartCondition } from '../types';

interface BroadcastStore extends CampaignState {
    setStep: (step: 1 | 2 | 3 | 4) => void;
    updateField: <K extends keyof CampaignState>(field: K, value: CampaignState[K]) => void;
    resetCampaign: () => void;
}

const initialState: CampaignState = {
    step: 1,
    targetStage: 'all',
    targetMajor: 'all',
    targetAudience: 'students',
    condition: 'all',
    selectedTeacherId: 'all', // 👈 جديد
    selectedEntityId: 'all',  // 👈 جديد
    targetCount: 0,
    msgType: 'whatsapp',
    messageBody: '',
    senderPhone: '',
    delaySeconds: 5,
    isScheduled: false,
    scheduleDate: '',
    logs: [],
};

export const useBroadcastStore = create<BroadcastStore>((set) => ({
    ...initialState,
    setStep: (step) => set({ step }),
    updateField: (field, value) => set((state) => ({ ...state, [field]: value })),
    resetCampaign: () => set(initialState),
}));