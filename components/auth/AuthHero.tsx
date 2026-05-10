"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function AuthHero() {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="auth-side-img"
        >
            <h2>مرحباً بك في بيكسل 🚀</h2>
            <motion.img 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                src="https://ouch-cdn2.icons8.com/P0-Gf7uT4Fp0_H-Eclh-p8z2W_9MIdHq1BwGjP7hM5o/rs:fit:456:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvNjgx/LzFkYzAzN2VjLTc5/YjEtNGU0Ny04YzFj/LTgxNjBlMTBjMDIw/OC5wbmc.png" 
                alt="Art" 
                className="floating-art" 
            />
        </motion.div>
    );
}