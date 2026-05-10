import { FaPlay, FaVideo, FaPenNib, FaVial, FaFileAlt } from 'react-icons/fa';
import { ItemType } from '../types/curriculum.types';

export const getIconForType = (type: ItemType) => {
    switch (type) {
        case 'lesson': return <FaPlay color="#3498db" />;
        case 'homework_lesson': return <FaVideo color="#9b59b6" />;
        case 'homework': return <FaPenNib color="#2ecc71" />;
        case 'exam': return <FaVial color="#e74c3c" />;
        default: return <FaFileAlt color="#f1c40f" />;
    }
};